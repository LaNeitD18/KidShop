import { ApiProperty } from '@nestjs/swagger';
import { CuaHang } from 'src/store/entities/store.entity';
import { NguoiDung } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Quay {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ApiProperty()
  @Column()
  tenQuay?: string;

  @OneToOne(() => NguoiDung)
  @JoinColumn()
  nhanVienTruc?: NguoiDung;

  @ManyToOne(() => CuaHang, (cuaHang) => cuaHang.dsQuay)
  cuaHang: CuaHang;
}
