import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { Appointment } from './entities/appointment.entity';
import { Payments } from 'src/payments/entities/payments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Patient, Appointment, Payments])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
