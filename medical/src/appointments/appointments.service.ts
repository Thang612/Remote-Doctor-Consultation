import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import * as dayjs from 'dayjs'; // Thư viện xử lý ngày
import * as crypto from 'crypto'; // Thư viện tạo chuỗi ngẫu nhiên
import { Payments } from 'src/payments/entities/payments.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Payments)
    private readonly paymentRepo: Repository<Payments>,
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
    if (!data.date || !data.doctor || !data.patient || !data.payment) {
      throw new Error('Thiếu thông tin đặt lịch hoặc thanh toán');
    }

    console.log(data);
    // ✅ Tạo `idMeeting` tự động
    data.idMeeting = this.generateMeetingId(
      data.doctor,
      data.patient,
      data.date,
    );

    // ✅ Lưu payment vào database
    const newPayment = this.paymentRepo.create(data.payment);
    await this.paymentRepo.save(newPayment);

    // ✅ Liên kết payment với lịch hẹn
    const appointment = this.appointmentRepo.create({
      ...data,
      payment: newPayment,
    });
    return await this.appointmentRepo.save(appointment);
  }
}
