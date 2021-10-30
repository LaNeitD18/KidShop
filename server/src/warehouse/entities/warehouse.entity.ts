import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Kho {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ApiProperty()
  @Column()
  diaChi: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  sdt?: string;
}
