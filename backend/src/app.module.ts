import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Course } from './courses/entities/course.entity'
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',          // đổi theo user MySQL
      password: '368925', // đổi theo pass MySQL
      database: 'learn_chinese', // DB bạn tạo trong DBeaver
      autoLoadEntities: true,
      synchronize: false, // true = tự tạo bảng, false = dùng bảng có sẵn
    }),
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
