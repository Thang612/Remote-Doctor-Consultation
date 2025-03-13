import { Module } from '@nestjs/common';
import { PrescriptionDetailsService } from './prescription-details.service';
import { PrescriptionDetailsController } from './prescription-details.controller';

@Module({
  providers: [PrescriptionDetailsService],
  controllers: [PrescriptionDetailsController]
})
export class PrescriptionDetailsModule {}
