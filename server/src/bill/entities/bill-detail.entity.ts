import { MatHang } from './../../product/entities/product.entity';
import { HoaDon } from 'src/bill/entities/bill.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CT_HOADON {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty()
  @Column()
  soLuong: number;

  @ApiProperty()
  @Column()
  tongTien: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  giamGia?: number;

  @ManyToOne(() => HoaDon, (hoaDon) => hoaDon.dsCTHoaDon)
  hoaDon: HoaDon;

  @ManyToOne(() => MatHang, (matHang) => matHang.dsCTHoaDon)
  matHang: MatHang;
}
