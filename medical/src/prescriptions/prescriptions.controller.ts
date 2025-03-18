import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { Prescriptions } from './entities/prescriptions.entity';
import { PrescriptionService } from './prescriptions.service';

@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post(':idMeeting')
  async create(
    @Param('idMeeting') idMeeting: string,
    @Body() createPrescriptionDto: CreatePrescriptionDto,
  ): Promise<Prescriptions> {
    return this.prescriptionService.createPrescription(
      idMeeting,
      createPrescriptionDto,
    );
  }
}
