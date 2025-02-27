import { Controller, Get } from '@nestjs/common';
import { DegreeService } from './degree.service';

@Controller('degree')
export class DegreeController {
  constructor(private readonly degreeService: DegreeService) {}

  @Get()
  async findAll() {
    return await this.degreeService.findAll();
  }
}
