import { HoaDon } from 'src/bill/entities/bill.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CuaHang } from 'src/store/entities/store.entity';
import { NguoiDung } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Quay {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty()
  @Column()
  tenQuay?: string;

  @OneToOne(() => NguoiDung)
  @JoinColumn()
  nhanVienTruc?: NguoiDung;

  @ManyToOne(() => CuaHang, (cuaHang) => cuaHang.dsQuay)
  cuaHang: CuaHang;

  @OneToMany(() => HoaDon, (hoaDon) => hoaDon.quay)
  dsHoaDon?: HoaDon[];
}
