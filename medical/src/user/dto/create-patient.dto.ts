import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  ValidateNested,
  IsString,
} from 'class-validator';

export class PatientDto {
  @IsString()
  blood: string;
}

export class CreatePatientDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @ValidateNested()
  @Type(() => PatientDto)
  patient: PatientDto;
}
