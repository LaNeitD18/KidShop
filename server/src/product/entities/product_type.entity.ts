import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LoatMatHang {
  @PrimaryGeneratedColumn()
  id?: string;

  @ApiProperty()
  @Column()
  tenLoaiMH: string;
}
