import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { GamesModule } from './games/games.module';
import { DecksModule } from './decks/decks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // thư mục chứa ảnh
      serveRoot: '/uploads', // prefix public
    }),
    CoursesModule,
    GamesModule,
    DecksModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
