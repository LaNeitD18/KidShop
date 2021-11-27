import { ApiTags } from '@nestjs/swagger';
import { PhieuNhapKho } from './entities/import-product-receipt.entity';
import { DetailImportReceiptService } from './service/detail-import-receipt.service';
import { CT_PhieuNhapKho } from './entities/detail-import-receipt';
import { CreateDetailImportDto } from './dto/create-detail-import.dto';
import { ProductService } from './../product/services/product.service';
import { WarehouseService } from './../warehouse/warehouse.service';
import { UserService } from './../user/user.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ImportProductReceiptService } from './service/import-product-receipt.service';
import { CreateImportProductReceiptDto } from './dto/create-import-product-receipt.dto';
import { UpdateImportProductReceiptDto } from './dto/update-import-product-receipt.dto';
import { Response } from 'express';

@ApiTags('import-product-receipt')
@Controller('import-product-receipt')
export class ImportProductReceiptController {
  constructor(
    private readonly importProductReceiptService: ImportProductReceiptService,
    private readonly detailImportService: DetailImportReceiptService,
    private readonly userService: UserService,
    private readonly warehouseService: WarehouseService,
    private readonly productService: ProductService,
  ) {}

  @Post()
  async createImportReceipt(
    @Body() data: CreateImportProductReceiptDto,
    @Res() res: Response,
  ) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New store information is required' });
    }

    try {
      const warehouseManager = await this.userService.findOne(
        data.idNguoiLap.toString(),
      );
      if (!warehouseManager) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a user with id ${data.idNguoiLap} to assign`,
        });
      }

      const warehouse = await this.warehouseService.findOne(
        data.idKho.toString(),
      );
      if (!warehouse) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: `Can not find a warehouse with id ${data.idKho}` });
      }

      const importReceiptData: PhieuNhapKho = {
        tongTien: data.tongTien,
        ghiChu: data.ghiChu,
        nguoiLap: warehouseManager,
        kho: warehouse,
      };
      const newImportReceipt = await this.importProductReceiptService.create(
        importReceiptData,
      );

      // for (const chiTiet of data.dsChiTietPhieuNhap) {
      //   const product = await this.productService.findOne(chiTiet.idMatHang);
      //   if (!product) {
      //     return res.status(HttpStatus.NOT_FOUND).json({
      //       message: `Can not find a product with id ${chiTiet.idMatHang}`,
      //     });
      //   }
      //   const newDetailImport = new CT_PhieuNhapKho();
      //   newDetailImport.matHang = product;
      //   newDetailImport.soLuong = chiTiet.soLuong;
      //   newDetailImport.phieuNhapKho = newImportReceipt;
      //   await this.detailImportService.create(newDetailImport);
      // }

      return res.status(HttpStatus.CREATED).json(newImportReceipt);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  findAll() {
    return this.importProductReceiptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importProductReceiptService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateImportProductReceiptDto: UpdateImportProductReceiptDto,
  ) {
    return this.importProductReceiptService.update(
      +id,
      updateImportProductReceiptDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.importProductReceiptService.remove(+id);
  }
}
