import { ApiProperty } from '@nestjs/swagger';
import { CreateDetailExportDto } from './create-detail-export.dto';
export class UpdateExportProductReceiptDto {
  @ApiProperty()
  idNguoiLap?: number;

  @ApiProperty()
  idKho?: number;

  @ApiProperty()
  idCuaHang?: number;

  @ApiProperty()
  trangThai?: number;

  @ApiProperty({ required: false })
  ghiChu?: string;

  @ApiProperty()
  dsChiTietPhieuXuat?: CreateDetailExportDto[];
}
