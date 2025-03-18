import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreatePrescriptionDetailDto } from 'src/prescription-details/dto/create-prescription-detail.dto';

export class CreatePrescriptionDto {
  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @IsString()
  @IsNotEmpty()
  symptom: string;

  @IsString()
  @IsNotEmpty()
  note: string;

  @IsArray()
  @IsNotEmpty()
  details: CreatePrescriptionDetailDto[];
}
