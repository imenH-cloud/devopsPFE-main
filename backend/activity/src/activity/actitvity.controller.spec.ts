import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './actitvity.controller';
import { ActivityService } from './actitvity.service';

describe('ActitvityController', () => {
  let controller: ActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [ActivityService],
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
