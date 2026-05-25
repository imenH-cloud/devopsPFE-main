import { Module } from '@nestjs/common';
import { StudentService } from './services/student.service';
import { StudentController } from './controller/student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports:[TypeOrmModule.forFeature([Student])]
})
export class StudentModule {}
