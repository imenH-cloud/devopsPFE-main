import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Activity } from './entities/actitvity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';


@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    try {
      const activity = this.activityRepository.create(createActivityDto);
      return await this.activityRepository.save(activity);
    } catch (error) {
      throw new BadRequestException('Failed to create activity');
    }
  }

  async findAll() {
    return await this.activityRepository.findAndCount({
     
    });

  
  }

  async findOne(id: number): Promise<Activity> {
    const activity = await this.activityRepository.findOne({ 
      where: { id },
    });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return activity;
  }

  async update(id: number, updateActivityDto: UpdateActivityDto): Promise<Activity> {
    const activity = await this.findOne(id);
    Object.assign(activity, updateActivityDto);
    try {
      return await this.activityRepository.save(activity);
    } catch (error) {
      throw new BadRequestException('Failed to update activity');
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.activityRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
  }

  async search(query: string) {
    return this.activityRepository.find({
      where: [
        { name: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
        { location: Like(`%${query}%`) },
      ],
      relations: ['student'],
    });
  }

  // async findByStudent(studentId: number) {
  //   return this.activityRepository.find({
  //     where: {
  //       classroom: { id: studentId }
  //     },
  //     order: {
  //       date: 'DESC'
  //     }
  //   });
  // }

  async completeActivity(id: number): Promise<Activity> {
    const activity = await this.findOne(id);
    activity.isCompleted = true;
    return this.activityRepository.save(activity);
  }
}