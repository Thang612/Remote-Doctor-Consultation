import { Injectable } from '@nestjs/common';
import { Doctor } from './entities/doctor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
  ) {}

  async getAllDoctors(): Promise<Doctor[]> {
    return await this.doctorRepo.find({
      relations: ['degree', 'specialty', 'user'],
    });
  }

  async getProfileDoctor(id: number): Promise<Doctor> {
    return await this.doctorRepo.findOne({
      where: { id },
      relations: ['user', 'degree', 'specialty'],
    });
  }
}
