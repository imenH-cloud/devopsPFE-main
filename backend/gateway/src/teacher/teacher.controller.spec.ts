import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

describe('TeacherController', () => {
  let controller: TeacherController;
  let service: TeacherService;

  const mockTeacherService = {
    create: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
    findAll: jest.fn(() => Promise.resolve([
      { id: 1, name: 'Prof A' },
      { id: 2, name: 'Prof B' },
    ])),
    findOne: jest.fn((id) => Promise.resolve({ id, name: 'Prof A' })),
    update: jest.fn((id, dto) => Promise.resolve({ id, ...dto })),
    remove: jest.fn((id) => Promise.resolve({ deleted: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [
        {
          provide: TeacherService,
          useValue: mockTeacherService,
        },
      ],
    }).compile();

    controller = module.get<TeacherController>(TeacherController);
    service = module.get<TeacherService>(TeacherService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a teacher', async () => {
    const dto: CreateTeacherDto = { name: 'New Teacher' };
    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1, name: 'New Teacher' });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all teachers', async () => {
    const result = await controller.findAll();
    expect(result.length).toBe(2);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one teacher by ID', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual({ id: '1', name: 'Prof A' });
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a teacher', async () => {
    const dto: UpdateTeacherDto = { name: 'Updated Teacher' };
    const result = await controller.update('1', dto);
    expect(result).toEqual({ id: '1', name: 'Updated Teacher' });
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should delete a teacher', async () => {
    const result = await controller.remove('1');
    expect(result).toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});

