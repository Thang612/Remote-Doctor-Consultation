import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePrescriptionDetailDto {
  @IsString()
  @IsNotEmpty()
  medical: string;

  @IsNumber()
  morning: number;

  @IsNumber()
  noon: number;

  @IsNumber()
  afternoon: number;

  @IsNumber()
  night: number;

  @IsOptional()
  @IsString()
  note?: string;
}
