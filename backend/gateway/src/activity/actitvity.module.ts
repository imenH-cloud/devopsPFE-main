import { Module } from '@nestjs/common';
import { ActivityService } from './actitvity.service';
import { ActivityController } from './actitvity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/actitvity.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Activity])],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActitvityModule {}
