import { Body, Controller, Post } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UserService } from './user.service';
import { CreatePatientDto } from './dto/create-patient.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/doctor')
  async createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    return this.userService.createDoctor(createDoctorDto);
  }

  @Post('/patient')
  async createPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.userService.createPatient(createPatientDto);
  }
}
