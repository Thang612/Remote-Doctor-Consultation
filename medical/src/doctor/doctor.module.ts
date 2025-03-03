import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { Degree } from 'src/degree/entities/degree.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Degree, Doctor, Specialty, User])],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
