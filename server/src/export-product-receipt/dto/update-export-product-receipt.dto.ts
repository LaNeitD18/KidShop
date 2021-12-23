import { ApiProperty } from '@nestjs/swagger';
export class UpdateExportProductReceiptDto {
  @ApiProperty()
  trangThai: number;

  @ApiProperty({ required: false })
  ghiChu?: string;
}
