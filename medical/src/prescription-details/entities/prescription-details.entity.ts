import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class PrescriptionDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Prescriptions, (prescription) => prescription.details, {
    eager: true,
  })
  prescription: Prescriptions;

  @Column()
  medical: string;

  @Column()
  morning: number;

  @Column()
  noon: number;

  @Column()
  afternoon: number;

  @Column()
  night: number;

  @Column({ nullable: true })
  note: string;
}
