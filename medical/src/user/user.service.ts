/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Degree } from 'src/degree/entities/degree.entity';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from 'src/patient/entities/patient.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    @InjectRepository(Degree) private degreeRepo: Repository<Degree>,
    @InjectRepository(Specialty) private specialtyRepo: Repository<Specialty>,
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
  ) {}

  async createDoctor(createUserDto: CreateDoctorDto) {
    const { firstName, lastName, email, password, doctor } = createUserDto;

    const degree = await this.degreeRepo.findOne({
      where: { id: doctor.degreeId },
    });
    if (!degree) throw new Error('Degree not found');

    const specialty = await this.specialtyRepo.findOne({
      where: { id: doctor.specialtyId },
    });
    if (!specialty) throw new Error('Specialty not found');

    const newUser = this.userRepo.create({
      firstName,
      lastName,
      email,
      password,
    });
    await this.userRepo.save(newUser);

    const newDoctor = this.doctorRepo.create({
      experience: doctor.experience,
      fee: doctor.fee,
      degree: degree,
      specialty: specialty,
      user: newUser,
    });
    await this.doctorRepo.save(newDoctor);

    return { user: newUser, doctor: newDoctor };
  }

  async createPatient(createPatientDto: CreatePatientDto) {
    const { firstName, lastName, email, password, patient } = createPatientDto;

    const newUser = this.userRepo.create({
      firstName,
      lastName,
      email,
      password,
    });

    await this.userRepo.save(newUser);

    const newPatient = this.patientRepo.create({
      blood: patient.blood,
    });

    await this.patientRepo.save(newPatient);
    return {user: newUser, patient: newPatient}
  }
}
