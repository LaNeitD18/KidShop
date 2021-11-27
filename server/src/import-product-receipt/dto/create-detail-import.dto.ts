import { ApiProperty } from '@nestjs/swagger';
export class CreateDetailImportDto {
  @ApiProperty()
  idMatHang: number;

  @ApiProperty()
  soLuong: number;
}
