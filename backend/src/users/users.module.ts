import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserBadge } from './entities/user-badge.entity';
import { UserActivity } from './entities/user-activity.entity';
import { UserMission } from './entities/user-mission.entity';
import { Badge } from './entities/badges.entity';
import { Achievement } from './entities/achievements.entity';
import { Mission } from './entities/missions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAchievement, UserBadge, UserActivity, UserMission, Badge, Achievement, Mission]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], 
})
export class UsersModule {}
