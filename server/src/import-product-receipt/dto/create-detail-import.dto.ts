import { ApiProperty } from '@nestjs/swagger';
export class CreateDetailImportDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  idMatHang: number;

  @ApiProperty()
  soLuong: number;
}
