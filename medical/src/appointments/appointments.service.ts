import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import * as dayjs from 'dayjs'; // Thư viện xử lý ngày
import * as crypto from 'crypto'; // Thư viện tạo chuỗi ngẫu nhiên

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  // ✅ Tạo mã `idMeeting` theo format: doctorId - patientId - YYYYMMDD - randomString
  private generateMeetingId(
    doctorId: any,
    patientId: any,
    date: string,
  ): string {
    const formattedDate = dayjs(date).format('YYYYMMDD'); // Chuyển ngày thành YYYYMMDD
    const randomString = crypto.randomBytes(3).toString('hex').slice(0, 5); // Lấy 5 ký tự ngẫu nhiên
    return `${doctorId}-${patientId}-${formattedDate}-${randomString}`;
  }

  // ✅ API tạo lịch hẹn mới
  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    if (!data.date || !data.doctor || !data.patient) {
      throw new Error('Thiếu thông tin đặt lịch');
    }

    console.log(data);
    // ✅ Tạo `idMeeting` tự động
    data.idMeeting = this.generateMeetingId(
      data.doctor,
      data.patient,
      data.date,
    );

    const appointment = this.appointmentRepo.create(data);
    return await this.appointmentRepo.save(appointment);
  }
}
