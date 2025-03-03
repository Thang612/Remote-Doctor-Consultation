import { Module } from '@nestjs/common';
import { DegreeController } from './degree.controller';
import { DegreeService } from './degree.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Degree } from './entities/degree.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Degree, Doctor])],
  controllers: [DegreeController],
  providers: [DegreeService],
})
export class DegreeModule {}
