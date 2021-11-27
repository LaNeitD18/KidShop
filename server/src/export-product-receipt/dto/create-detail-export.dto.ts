import { ApiProperty } from '@nestjs/swagger';

export class CreateDetailExportDto {
  @ApiProperty()
  idMatHang: number;

  @ApiProperty()
  soLuong: number;

  @ApiProperty()
  idCuaHang: number;
}
