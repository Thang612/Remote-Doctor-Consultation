import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescriptions } from './entities/prescriptions.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { PrescriptionDetails } from 'src/prescription-details/entities/prescription-details.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectRepository(Prescriptions)
    private readonly prescriptionRepository: Repository<Prescriptions>,
    @InjectRepository(PrescriptionDetails)
    private readonly prescriptionDetailsRepository: Repository<PrescriptionDetails>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async createPrescription(
    idMeeting: string,
    createPrescriptionDto: CreatePrescriptionDto,
  ) {
    const { details, ...prescriptionData } = createPrescriptionDto;

    // Fetch the appointment by idMeeting
    const appointment = await this.appointmentRepository.findOne({
      where: { idMeeting },
      relations: ['doctor', 'patient'],
    });
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Create the prescription and associate it with the appointment
    const prescription = this.prescriptionRepository.create({
      ...prescriptionData,
      appointment, // Associate the prescription with the appointment
    });

    await this.prescriptionRepository.save(prescription);

    // Create the details for the prescription
    const prescriptionDetails = details.map((detail) => {
      const prescriptionDetail = this.prescriptionDetailsRepository.create({
        ...detail,
        prescription,
      });
      return prescriptionDetail;
    });

    // Save the details
    await this.prescriptionDetailsRepository.save(prescriptionDetails);

    return prescription;
  }
}
