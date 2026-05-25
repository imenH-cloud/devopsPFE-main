import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { UpdateClassroomDto } from '../dto/update-classroom.dto';
import { ClassroomService } from '../services/classroom.service';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  async create(@Body() createClassroomDto: CreateClassroomDto) {
    console.log('[POST /classroom] Received data:', createClassroomDto);
    try {
      const result = await this.classroomService.create(createClassroomDto);
      console.log('[POST /classroom] ✅ Created successfully:', result);
      return result;
    } catch (error) {
      console.error('[POST /classroom] ❌ Error:', error);
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.classroomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classroomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassroomDto: UpdateClassroomDto) {
    return this.classroomService.update(+id, updateClassroomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classroomService.remove(+id);
  }
}
