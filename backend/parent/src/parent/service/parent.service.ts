import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from '../entities/parent.entity';
import { CreateParentDto } from '../dto/create-parent.dto';
import { UpdateParentDto } from '../dto/update-parent.dto';

@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
  ) {}

  async create(createParentDto: CreateParentDto): Promise<Parent> {
    const parent = this.parentRepository.create(createParentDto);
    return await this.parentRepository.save(parent);
  }

  async findAll(): Promise<Parent[]> {
    return await this.parentRepository.find();
  }

  async findOne(id: number): Promise<Parent> {
    const parent = await this.parentRepository.findOne({ where: { id } });
    if (!parent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
    return parent;
  }

  async update(id: number, updateParentDto: UpdateParentDto): Promise<Parent> {
    const parent = await this.findOne(id);
    
    // Update the parent with new values
    Object.assign(parent, updateParentDto);
    
    return await this.parentRepository.save(parent);
  }

  async remove(id: number): Promise<void> {
    const result = await this.parentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
  }

  // Additional methods you might want to add

  async findByEmail(email: string) {
    return await this.parentRepository.findOne({ where: { email } });
  }

  async findWithChildren(id: number): Promise<Parent> {
    const parent = await this.parentRepository.findOne({ 
      where: { id },
      relations: ['children']
    });
    
    if (!parent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
    
    return parent;
  }
}