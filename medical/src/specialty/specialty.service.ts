import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialty } from './entities/specialty.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpecialtyService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepo: Repository<Specialty>,
  ) {}

  async findAll(): Promise<Specialty[]> {
    return await this.specialtyRepo.find();
  }
}
