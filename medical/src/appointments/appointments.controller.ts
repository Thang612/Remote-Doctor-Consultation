import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  // ✅ API POST: Tạo lịch hẹn mới
  @Post()
  async create(@Body() body: Partial<Appointment>) {
    if (!body.date || !body.doctor || !body.patient) {
      throw new BadRequestException('Thiếu thông tin đặt lịch');
    }

    const appointment = await this.appointmentService.createAppointment(body);
    return { message: 'Đặt lịch thành công!', appointment };
  }
}
