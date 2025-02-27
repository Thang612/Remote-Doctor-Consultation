import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Degree } from './entities/degree.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DegreeService {
  constructor(
    @InjectRepository(Degree)
    private readonly degreeRepo: Repository<Degree>,
  ) {}

  async findAll(): Promise<Degree[]> {
    return await this.degreeRepo.find();
  }
}
