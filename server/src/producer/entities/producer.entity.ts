import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class NhaSanXuat {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty()
  @Column()
  tenNSX: string;

  @ApiProperty()
  @Column()
  diaChi: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  sdt?: string;

  @CreateDateColumn()
  taoLuc?: Date;

  @UpdateDateColumn()
  suaLuc?: Date;
}
