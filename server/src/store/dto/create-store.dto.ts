import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class CreateStoreDto {
  @ApiProperty()
  diaChi: string;

  @ApiProperty()
  kinhDo: number;

  @ApiProperty()
  viDo: number;

  @ApiProperty()
  viTri: string;

  @ApiProperty()
  sdt: string;

  @ApiProperty()
  maChuCuaHang: string;
}
