import { PhieuXuatKho } from './../../export-product-receipt/entities/export-product-receipt.entity';
import { Quay } from './../../counter/entities/counter.entity';
import { ApiProperty } from '@nestjs/swagger';
import { NguoiDung } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CuaHang {
  @PrimaryGeneratedColumn('increment')
  id?: string;

  @ApiProperty()
  @Column()
  diaChi: string;

  @ApiProperty()
  @Column({ type: 'float', default: 0.0 })
  kinhDo: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0.0 })
  viDo: number;

  @ApiProperty()
  @Column()
  sdt: string;

  @ApiProperty()
  @Column()
  viTri: string;

  @ManyToOne(() => NguoiDung)
  @JoinColumn()
  chuCuaHang: NguoiDung;

  @OneToMany(() => Quay, (quay) => quay.cuaHang)
  dsQuay?: Quay[];

  @CreateDateColumn()
  taoLuc?: Date;

  @UpdateDateColumn()
  suaLuc?: Date;

  @OneToMany(() => PhieuXuatKho, (phieuXuat) => phieuXuat.cuaHang)
  dsPhieuXuatKho?: PhieuXuatKho[];
}
