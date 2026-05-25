import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Activity } from './entities/actitvity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    console.log('[POST /activity] Received data:', createActivityDto);
    const activity = new Activity();
    Object.assign(activity, createActivityDto);
    console.log('[POST /activity] Saving activity:', activity);
    try {
      const result = await this.activityRepository.save(activity);
      console.log('[POST /activity] ✅ Created successfully:', result);
      return result;
    } catch (error) {
      console.error('[POST /activity] ❌ Error:', error);
      throw error;
    }
  }

  async findAll(): Promise<Activity[]> {
    return this.activityRepository.find();
  }

  async search(query: string): Promise<Activity[]> {
    return this.activityRepository.find({
      where: [
        { name: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
      ],
    });
  }

  async findOne(id: number): Promise<Activity> {
    const activity = await this.activityRepository.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity with id ${id} not found`);
    }
    return activity;
  }

  async update(id: number, updateActivityDto: UpdateActivityDto): Promise<Activity> {
    const updateData: any = { ...updateActivityDto };
    await this.activityRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.activityRepository.delete(id);
  }

  async completeActivity(id: number): Promise<Activity> {
    await this.activityRepository.update(id, { isCompleted: true });
    return this.findOne(id);
  }
}
