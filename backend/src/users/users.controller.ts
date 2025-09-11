import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OptionalJwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('me/dashboard')
  async getDashboard(@Req() req: any) {
    const userId = req.user?.id;

    if (!userId) {
      // Đảm bảo luôn trả JSON hợp lệ
      return { studyStats: null, message: 'Guest user' };
    }
    const user = await this.usersService.getUserDashboard(userId);
    return { user };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post(':id/play')
  async recordGamePlay(
    @Param('id') id: string,
    @Req() req,
    @Body() body: { correct: number; total: number; timeSpent: number },
  ) {
    console.log('recordGamePlay req.user =', req.user);
    console.log('body =', body);

    const userId = req.user?.id;

    if (!userId) {
      return { message: 'User not authenticated' };
    }

    return this.usersService.recordGamePlay(userId, +id, body);
  }
}
