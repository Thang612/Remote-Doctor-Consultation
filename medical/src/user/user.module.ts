import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Degree } from 'src/degree/entities/degree.entity';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Doctor, Degree, Specialty, Patient]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
