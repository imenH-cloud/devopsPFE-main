import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseIntPipe,
  Put 
} from '@nestjs/common';
import { ActivityService } from './actitvity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';


@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  @Get()
  findAll(
 
  ) {
    return this.activityService.findAll();
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.activityService.search(query);
  }

  // @Get('student/:studentId')
  // findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
  //   return this.activityService.findByStudent(studentId);
  // }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activityService.update(id, updateActivityDto);
  }

  @Put(':id/complete')
  completeActivity(@Param('id', ParseIntPipe) id: number) {
    return this.activityService.completeActivity(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.activityService.remove(id);
  }
}