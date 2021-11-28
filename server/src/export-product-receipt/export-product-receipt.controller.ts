import { CT_PhieuXuatKho } from './entities/detail-export-receipt.entity';
import { StoreService } from './../store/store.service';
import { PhieuXuatKho } from './entities/export-product-receipt.entity';
import { ProductService } from './../product/services/product.service';
import { WarehouseService } from './../warehouse/warehouse.service';
import { UserService } from './../user/user.service';
import { ApiTags } from '@nestjs/swagger';
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
import { ExportProductReceiptService } from './service/export-product-receipt.service';
import { CreateExportProductReceiptDto } from './dto/create-export-product-receipt.dto';
import { UpdateExportProductReceiptDto } from './dto/update-export-product-receipt.dto';
import { DetailExportReceiptService } from './service/detail-export-receipt.service';
import { Response } from 'express';

@ApiTags('export-product-receipt')
@Controller('export-product-receipt')
export class ExportProductReceiptController {
  constructor(
    private readonly exportProductReceiptService: ExportProductReceiptService,
    private readonly detailExportService: DetailExportReceiptService,
    private readonly userService: UserService,
    private readonly warehouseService: WarehouseService,
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
  ) {}

  @Post()
  async createExportReceipt(
    @Body() data: CreateExportProductReceiptDto,
    @Res() res: Response,
  ) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New export receipt information is required' });
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

      const store = await this.storeService.findOne(data.idCuaHang.toString());
      if (!store) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: `Can not find a store with id ${data.idCuaHang}` });
      }

      const exportReceiptData: PhieuXuatKho = {
        ghiChu: data.ghiChu,
        nguoiLap: warehouseManager,
        kho: warehouse,
        cuaHang: store,
      };
      const newExportReceipt = await this.exportProductReceiptService.create(
        exportReceiptData,
      );

      for (const chiTiet of data.dsChiTietPhieuXuat) {
        const product = await this.productService.findOne(chiTiet.idMatHang);
        if (!product) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: `Can not find a product with id ${chiTiet.idMatHang}`,
          });
        }

        const newDetailExport: CT_PhieuXuatKho = {
          matHang: product,
          soLuong: chiTiet.soLuong,
          phieuXuatKho: newExportReceipt,
        };
        await this.detailExportService.create(newDetailExport);
      }

      return res.status(HttpStatus.CREATED).json(newExportReceipt);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  findAll() {
    return this.exportProductReceiptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.exportProductReceiptService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateExportProductReceiptDto: UpdateExportProductReceiptDto,
  ) {
    return this.exportProductReceiptService.update(
      id,
      updateExportProductReceiptDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.exportProductReceiptService.remove(+id);
  }
}
