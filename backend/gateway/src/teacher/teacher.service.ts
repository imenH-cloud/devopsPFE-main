import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    try {
      const teacher = this.teacherRepository.create(createTeacherDto);
      return await this.teacherRepository.save(teacher);
    } catch (error) {
      throw new BadRequestException('Failed to create teacher');
    }
  }

  async findAll(options: { page: number; limit: number }) {
    const [items, total] = await this.teacherRepository.findAndCount({
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    });

    return {
      items,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  async findOne(id: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.findOne(id);
    Object.assign(teacher, updateTeacherDto);
    try {
      return await this.teacherRepository.save(teacher);
    } catch (error) {
      throw new BadRequestException('Failed to update teacher');
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.teacherRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
  }

  async search(query: string) {
    return this.teacherRepository.find({
      where: [
        { firstName: Like(`%${query}%`) },
        { surname: Like(`%${query}%`) },
        { email: Like(`%${query}%`) },
        { specialization: Like(`%${query}%`) },
      ],
    });
  }
}