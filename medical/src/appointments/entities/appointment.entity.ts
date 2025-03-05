import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Doctor } from '../../doctor/entities/doctor.entity';
import { User } from '../../user/entities/user.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { Payments } from 'src/payments/entities/payments.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string; // YYYY-MM-DD

  @Column()
  idMeeting: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, { eager: true })
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments, { eager: true })
  patient: User; // Người đặt lịch

  @CreateDateColumn()
  startTime: Date; // Ngày tạo lịch hẹn

  @Column()
  note: string;

  @OneToOne(() => Payments, (payment) => payment.appointment)
  @JoinColumn()
  payment: Payments;
}
