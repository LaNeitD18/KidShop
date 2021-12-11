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
      const storeManager = await this.userService.findOne(
        data.idNguoiLap.toString(),
      );
      if (!storeManager) {
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
        trangThai: data.trangThai,
        ghiChu: data.ghiChu,
        nguoiLap: storeManager,
        quanLyKho: warehouse.quanLyKho,
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

  @Get('all/:placeId')
  async fetchAllExportReceipts(
    @Param('placeId') placeId: number,
    @Body() place: string,
    @Res() res: Response,
  ) {
    try {
      if (place == 'warehouse') {
        const warehouse = await this.warehouseService.findOne(
          placeId.toString(),
        );
        if (!warehouse) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: `Can not find a warehouse with id ${placeId}` });
        }
      } else if (place == 'store') {
        const store = await this.storeService.findOne(placeId.toString());
        if (!store) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: `Can not find a store with id ${placeId}` });
        }
      }

      const receipts = await this.exportProductReceiptService.findAll(
        placeId,
        place,
      );
      return res.status(HttpStatus.OK).json(receipts);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async fetchExportReceipt(@Param('id') id: number, @Res() res: Response) {
    try {
      const receipt = await this.exportProductReceiptService.findOne(id);
      if (!receipt) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find an export receipt with id ${id}`,
        });
      }
      return res.status(HttpStatus.OK).json(receipt);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async updateImportReceipt(
    @Param('id') id: number,
    @Body() data: UpdateExportProductReceiptDto,
    @Res() res: Response,
  ) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New export receipt information is required' });
    }

    return this.exportProductReceiptService.update(id, data);
  }

  @Delete(':id')
  async deleteExportReceipt(@Param('id') id: number, @Res() res: Response) {
    try {
      const receipt = await this.exportProductReceiptService.findOne(id);
      if (!receipt) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`Can not find a receipt with id ${id} to delete`);
      }

      for (const chiTiet of receipt.dsCTPhieuXuat) {
        const detail = await this.detailExportService.findOne(chiTiet.id);
        if (!detail) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: `Can not find a detail with id ${chiTiet.id}`,
          });
        }
        await this.detailExportService.remove(detail.id);
      }

      await this.exportProductReceiptService
        .remove(id)
        .then(() =>
          res.status(HttpStatus.OK).send('Delete export receipt successfully'),
        );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
