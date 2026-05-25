import { Module } from '@nestjs/common';
import { ClassroomController } from './controller/classroom.controller';
import { ClassroomService } from './services/classroom.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from './entities/classroom.entity';

@Module({
  controllers: [ClassroomController],
  providers: [ClassroomService],
  imports:[TypeOrmModule.forFeature([Classroom])]
})
export class ClassroomModule {}
