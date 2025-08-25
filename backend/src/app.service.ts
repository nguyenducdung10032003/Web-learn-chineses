import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './courses/entities/course.entity';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
