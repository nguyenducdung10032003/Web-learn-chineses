import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Mission } from './entities/missions.entity';
import { UserMission } from './entities/user-mission.entity';
import { StudyStats } from 'src/decks/entities/studyStats.entity';
import { StudyActivity } from 'src/decks/entities/studyActivity.entity';
import { UserActivity } from './entities/user-activity.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Mission) private missionRepo: Repository<Mission>,
    @InjectRepository(UserMission)
    private userMissionRepo: Repository<UserMission>,
    @InjectRepository(StudyStats) private statsRepo: Repository<StudyStats>,
    // @InjectRepository(StudyActivity)
    // private activityRepo: Repository<StudyActivity>,
    @InjectRepository(UserActivity)
    private userActivityRepo: Repository<UserActivity>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmailWithRelations(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: [
        'badges',
        'badges.badge',
        'activities',
        'missions',
        'missions.mission',
        'studyStats',
      ],
    });
  }

  async getUserDashboard(userId: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.badges', 'userBadges')
      .leftJoinAndSelect('userBadges.badge', 'badge')
      .leftJoinAndSelect('user.activities', 'activities')
      .leftJoinAndSelect('user.missions', 'userMissions')
      .leftJoinAndSelect('userMissions.mission', 'mission')
      .leftJoinAndSelect('user.studyStats', 'studyStats')
      .where('user.id = :userId', { userId })
      .orderBy({
        'userBadges.earnedAt': 'DESC',
        'activities.activityTime': 'DESC',
        'userMissions.updatedAt': 'DESC',
        'studyStats.updatedAt': 'DESC',
      })
      .getOne();

    if (user) {
      user.badges = user.badges?.slice(0, 4) || [];
      user.activities = user.activities?.slice(0, 4) || [];
      user.missions = user.missions?.slice(0, 4) || [];
    }

    return user;
  }

  async recordGamePlay(
    userId: number,
    gameId: number,
    result: { correct: number; total: number; timeSpent: number },
  ) {
    const { correct, total, timeSpent } = result;
    const accuracy = (correct / total) * 100;

    // 1. Cập nhật study_stats
    let stats = await this.statsRepo.findOne({ where: { userId } });
    if (!stats) {
      stats = this.statsRepo.create({
        userId,
        totalCards: 0,
        studiedToday: 0,
        streak: 0,
        accuracy: 0,
        timeSpent: 0,
      });
    }

    stats.totalCards += total;
    stats.studiedToday += total;
    stats.timeSpent += timeSpent;

    const prevCorrect = (stats.accuracy / 100) * (stats.totalCards - total);
    stats.accuracy = ((prevCorrect + correct) / stats.totalCards) * 100;

    // streak logic (giống flashcard)
    const today = new Date();
    if (stats.lastStudied) {
      const diffDays = Math.floor(
        (today.getTime() - stats.lastStudied.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays === 1) stats.streak += 1;
      else if (diffDays > 1) stats.streak = 1;
    } else {
      stats.streak = 1;
    }
    stats.lastStudied = today;

    await this.statsRepo.save(stats);

    // 2. Ghi user_activity
    const xpEarned = correct * 10 + (total - correct) * 5;
    const userActivity = this.userActivityRepo.create({
      userId,
      type: 'game',
      title: `Chơi game ${gameId}: ${correct}/${total} đúng`,
      xp: xpEarned,
      activityTime: today,
    });
    await this.userActivityRepo.save(userActivity);

    // 3. Cập nhật XP và streak cho user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.xp += xpEarned;

      if (user.lastActive) {
        const diffDays = Math.floor(
          (today.getTime() - new Date(user.lastActive).getTime()) /
            (1000 * 60 * 60 * 24),
        );
        if (diffDays === 1) user.streak += 1;
        else if (diffDays > 1) user.streak = 1;
      } else {
        user.streak = 1;
      }

      user.lastActive = today;

      if (user.xp >= user.xpToNextLevel) {
        user.level += 1;
        user.xp = user.xp - user.xpToNextLevel;
        user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.5);
      }

      await this.userRepository.save(user);
    }

    return { message: 'Game play recorded', stats };
  }
}
