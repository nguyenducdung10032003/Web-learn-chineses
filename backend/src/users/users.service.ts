import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Mission } from './entities/missions.entity';
import { UserMission } from './entities/user-mission.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Mission) private missionRepo: Repository<Mission>,
    @InjectRepository(UserMission)
    private userMissionRepo: Repository<UserMission>,
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
      ],
    });
  }

  async getUserDashboard(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'badges',
        'badges.badge',
        'activities',
        'missions',
        'missions.mission',
      ],
    });
  }
}
