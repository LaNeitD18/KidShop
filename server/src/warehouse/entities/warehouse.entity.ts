import { ApiProperty } from '@nestjs/swagger';
import { NguoiDung } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Kho {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty()
  @Column()
  diaChi: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  sdt?: string;

  @ApiProperty()
  @Column({ type: 'float', default: 0.0 })
  kinhDo: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0.0 })
  viDo: number;

  @ApiProperty()
  @Column()
  viTri: string;

  @CreateDateColumn()
  taoLuc?: Date;

  @UpdateDateColumn()
  suaLuc?: Date;

  @OneToOne(() => NguoiDung)
  @JoinColumn()
  quanLyKho: NguoiDung;
}
