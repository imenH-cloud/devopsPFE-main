import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from '../entities/classroom.entity';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { UpdateClassroomDto } from '../dto/update-classroom.dto';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
  ) {}

  async create(createClassroomDto: CreateClassroomDto): Promise<Classroom> {
    const classroom = this.classroomRepository.create(createClassroomDto);
    return await this.classroomRepository.save(classroom);
  }

  async findAll(): Promise<Classroom[]> {
    // Supprimer les relations 'students' et 'activities'
    return await this.classroomRepository.find();
  }

  async findOne(id: number): Promise<Classroom> {
    // Supprimer les relations 'students' et 'activities'
    const classroom = await this.classroomRepository.findOne({
      where: { id },
    });
    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }
    return classroom;
  }

  async update(id: number, updateClassroomDto: UpdateClassroomDto): Promise<Classroom> {
    const classroom = await this.classroomRepository.preload({
      id,
      ...updateClassroomDto,
    });
    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }
    return await this.classroomRepository.save(classroom);
  }

  async remove(id: number): Promise<void> {
    const result = await this.classroomRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }
  }
}