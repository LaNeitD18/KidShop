import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KhachHang } from './customer.entity';

@Entity()
export class CT_KhachHang {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty()
  @Column()
  hoTenCon: string;

  @ApiProperty()
  @Column()
  gioiTinhCon?: string;

  @ApiProperty()
  @Column()
  ngaySinhCon: Date;

  @CreateDateColumn()
  taoLuc?: Date;

  @UpdateDateColumn()
  suaLuc?: Date;

  @ManyToOne(() => KhachHang, (khachHang) => khachHang.dsCTKhachHang)
  khachHang: KhachHang

}
