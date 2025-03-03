import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class DoctorDto {
  @IsNumber()
  experience: number;

  @IsNumber()
  fee: number;

  @IsNumber()
  degreeId: number;

  @IsNumber()
  specialtyId: number;
}

export class CreateDoctorDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @ValidateNested()
  @Type(() => DoctorDto)
  doctor: DoctorDto;
}
