import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Specialty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
