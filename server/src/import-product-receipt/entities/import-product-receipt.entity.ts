import { CT_PhieuNhapKho } from './detail-import-receipt';
import { NguoiDung } from './../../user/entities/user.entity';
import { Kho } from './../../warehouse/entities/warehouse.entity';
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

@Entity()
export class PhieuNhapKho {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty()
  @Column()
  tongTien: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  ghiChu?: string;

  @CreateDateColumn()
  taoLuc?: Date;

  @UpdateDateColumn()
  suaLuc?: Date;

  @ApiProperty()
  @ManyToOne(() => Kho, (kho) => kho.dsPhieuNhapKho)
  kho: Kho;

  @ApiProperty()
  @ManyToOne(() => NguoiDung, (nguoiDung) => nguoiDung.dsPhieuNhapKho)
  nguoiLap: NguoiDung;

  @OneToMany(() => CT_PhieuNhapKho, (ctPhieuNhap) => ctPhieuNhap.phieuNhapKho)
  dsCTPhieuNhap?: CT_PhieuNhapKho[];
}
