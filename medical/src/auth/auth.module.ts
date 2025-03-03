import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { Degree } from 'src/degree/entities/degree.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Doctor, Specialty, Degree, Patient]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
