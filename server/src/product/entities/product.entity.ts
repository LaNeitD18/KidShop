import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MatHang {
  @PrimaryGeneratedColumn()
  id?: string;

  @ApiProperty()
  @Column()
  tenMH: string;

  @ApiProperty()
  @Column()
  donVi: string;

  @ApiProperty()
  @Column()
  giaNhap: number;

  @ApiProperty()
  @Column()
  giaBan: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  kichThuoc?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  mauSac?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  hinhAnh?: string;
}
