import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Degree {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Doctor, (doctor) => doctor.degree)
  doctors: Doctor[];
}
