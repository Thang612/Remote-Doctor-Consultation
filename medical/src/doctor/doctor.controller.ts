import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './entities/doctor.entity';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}
  @Get()
  async getAllDoctors() {
    return await this.doctorService.getAllDoctors();
  }

  @Get(':id')
  async getDoctorProfile(@Param('id') id: number): Promise<Doctor> {
    const doctor = await this.doctorService.getProfileDoctor(id);

    if (!doctor) {
      throw new NotFoundException(`Không tìm thấy bác sĩ với ID ${id}`);
    }

    return doctor;
  }
}
