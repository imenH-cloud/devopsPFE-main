import { Module } from '@nestjs/common';
import { ParentController } from './controller/parent.controller';
import { ParentService } from './service/parent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parent])], // ✅ OK ici
  controllers: [ParentController],
  providers: [ParentService],
  exports: [ParentService, TypeOrmModule], // ✅ Corrigé ici
})
export class ParentModule {}
