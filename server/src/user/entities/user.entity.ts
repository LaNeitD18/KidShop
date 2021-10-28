import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NguoiDung {
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty()
  @Column()
  tenTaiKhoan: string;

  @ApiProperty()
  @Column()
  matKhau: string;

  @ApiProperty()
  @Column()
  hoTen: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  diaChi?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  sdt?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  gioiTinh?: string;

  // maNhom: string
}
