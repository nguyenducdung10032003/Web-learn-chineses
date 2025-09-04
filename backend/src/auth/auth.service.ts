import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exist = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exist) throw new UnauthorizedException('Email đã tồn tại');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
    });
    // 1. Lưu user mới
    const savedUser = await this.usersRepo.save(user);

    // 2. Lấy mission daily mặc định
    const missions = await this.userService['missionRepo'].find({
      where: { type: 'daily' },
    });

    // 3. Gán vào user_missions
    const userMissions = missions.map((mission) =>
      this.userService['userMissionRepo'].create({
        user: savedUser,
        mission,
        progress: 0,
        completed: false,
        claimed: false,
      }),
    );

    await this.userService['userMissionRepo'].save(userMissions);

    return { message: 'Register success', user: savedUser };
  }

  async login(dto: LoginDto) {
    // const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    const user = await this.userService.findByEmailWithRelations(dto.email);
    if (!user) throw new UnauthorizedException('User not found');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Wrong password');

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    const dashboardData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      xpToNextLevel: user.xpToNextLevel,
      streak: user.streak,
      totalLessons: user.totalLessons,
      completedLessons: user.completedLessons,
      badges:
        user.badges?.map((b) => ({
          id: b.badge.id,
          name: b.badge.name,
          icon: b.badge.icon,
          earned: b.earned,
        })) || [],
      recentActivity:
        user.activities?.map((a) => ({
          id: a.id,
          type: a.type,
          title: a.title,
          xp: a.xp,
          time: a.activityTime,
        })) || [],
      dailyMissions:
        user.missions
          ?.filter((m) => m.mission.type === 'daily')
          .map((um) => ({
            id: um.mission.id,
            title: um.mission.title,
            progress: um.progress,
            target: um.mission.maxProgress,
            xp: um.mission.xpReward,
            completed: um.completed,
          })) || [],
    };

    const { password, ...result } = user;
    return { token, user: dashboardData };
  }
}
