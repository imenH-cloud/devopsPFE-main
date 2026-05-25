import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateParentDto } from '../dto/create-parent.dto';
import { UpdateParentDto } from '../dto/update-parent.dto';
import { ParentService } from '../service/parent.service';

@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}
  @Post()
  async create(@Body() createParentDto: CreateParentDto) {
    console.log('[POST /parent] Received:', createParentDto);
    try {
      const result = await this.parentService.create(createParentDto);
      console.log('[POST /parent] Success:', result);
      return result;
    } catch (error) {
      console.error('[POST /parent] Error:', error.message, error);
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.parentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParentDto: UpdateParentDto) {
    return this.parentService.update(+id, updateParentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parentService.remove(+id);
  }
}
