import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrescriptionService } from './prescriptions.service';
import { PrescriptionDetails } from 'src/prescription-details/entities/prescription-details.entity';
import { Prescriptions } from './entities/prescriptions.entity';
import { PrescriptionController } from './prescriptions.controller';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prescriptions, PrescriptionDetails, Appointment]),
  ],
  providers: [PrescriptionService],
  controllers: [PrescriptionController],
})
export class PrescriptionModule {}
