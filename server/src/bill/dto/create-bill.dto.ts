import { CreateBillDetailDto } from './create-bill-detail.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBillDto {
  @ApiProperty()
  idNguoiLap: number;

  @ApiProperty()
  idKhachHang?: number;

  @ApiProperty()
  idQuay: number;

  @ApiProperty()
  tongHoaDon: number;

  @ApiProperty()
  dsCTHoaDon: CreateBillDetailDto[];
}
