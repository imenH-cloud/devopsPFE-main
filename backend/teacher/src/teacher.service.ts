import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Teacher } from './teacher.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
  ) {}

  async findAll(page: number, limit: number) {
    const [items, total] = await this.teachersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async search(query: string) {
    if (!query) return [];
    return this.teachersRepository.find({
      where: [
        { firstName: Like(`%${query}%`) },
        { surname: Like(`%${query}%`) },
        { email: Like(`%${query}%`) },
        { indexNumber: Like(`%${query}%`) },
      ],
    });
  }

  async findOne(id: number) {
    return this.teachersRepository.findOneBy({ id });
  }

  async create(dto: any) {
    const teacher = this.teachersRepository.create(dto);
    return this.teachersRepository.save(teacher);
  }

  async update(id: number, dto: any) {
    await this.teachersRepository.update(id, dto);
    return this.teachersRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const teacher = await this.teachersRepository.findOneBy({ id });
    if (teacher) {
      await this.teachersRepository.remove(teacher);
      return teacher;
    }
    return null;
  }
}
