import { ApiProperty } from '@nestjs/swagger';
import { CreateDetailImportDto } from './create-detail-import.dto';

export class CreateImportProductReceiptDto {
  @ApiProperty()
  idNguoiLap?: number;

  @ApiProperty()
  idKho?: number;

  @ApiProperty()
  tongTien?: number;

  @ApiProperty({ required: false })
  ghiChu?: string;

  @ApiProperty()
  dsChiTietPhieuNhap?: CreateDetailImportDto[];
}
