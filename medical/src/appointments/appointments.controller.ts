import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  // ✅ API POST: Tạo lịch hẹn mới
  @Post()
  async create(@Body() body: Partial<Appointment>) {
    if (!body.date || !body.doctor || !body.patient || !body.payment) {
      throw new BadRequestException('Thiếu thông tin đặt lịch');
    }

    const appointment = await this.appointmentService.createAppointment(body);
    return { message: 'Đặt lịch thành công!', appointment };
  }

  // ✅ API lấy danh sách lịch hẹn theo patientId
  @Get('/patient/:patientId')
  async getAppointmentsByPatientId(
    @Param('patientId') patientId: number,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByPatientId(patientId);
  }

  // ✅ API lấy danh sách lịch hẹn theo doctorId
  @Get('/doctor/:doctorId')
  async getAppointmentsByDoctorId(
    @Param('doctorId') doctorId: number,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByDoctorId(doctorId);
  }

  // ✅ API lọc lịch hẹn theo patientId và startTime (YYYY-MM-DD)
  @Get('/patient/:patientId/by-date')
  async getAppointmentsByPatientIdAndTime(
    @Param('patientId') patientId: number,
    @Query('startTime') startTime: string,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByPatientIdAndTime(
      patientId,
      startTime,
    );
  }

  // ✅ API lọc lịch hẹn theo doctorId và startTime (YYYY-MM-DD)
  @Get('/doctor/:doctorId/by-date')
  async getAppointmentsByDoctorIdAndTime(
    @Param('doctorId') doctorId: number,
    @Query('startTime') startTime: string,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByDoctorIdAndTime(
      doctorId,
      startTime,
    );
  }
}
