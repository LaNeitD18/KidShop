import { ApiTags } from '@nestjs/swagger';
import { PhieuNhapKho } from './entities/import-product-receipt.entity';
import { DetailImportReceiptService } from './service/detail-import-receipt.service';
import { CT_PhieuNhapKho } from './entities/detail-import-receipt.entity';
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
        .json({ message: 'New import receipt information is required' });
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

      for (const chiTiet of data.dsChiTietPhieuNhap) {
        const product = await this.productService.findOne(chiTiet.idMatHang);
        if (!product) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: `Can not find a product with id ${chiTiet.idMatHang}`,
          });
        }
        const newDetailImport = new CT_PhieuNhapKho();
        newDetailImport.matHang = product;
        newDetailImport.soLuong = chiTiet.soLuong;
        newDetailImport.phieuNhapKho = newImportReceipt;
        await this.detailImportService.create(newDetailImport);
      }

      return res.status(HttpStatus.CREATED).json(newImportReceipt);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // TODO
  @Get('all/:warehouseId')
  async fetchAllImportReceipts(
    @Param('warehouseId') warehouseId: number,
    @Res() res: Response,
  ) {
    try {
      const warehouse = await this.warehouseService.findOne(
        warehouseId.toString(),
      );
      if (!warehouse) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: `Can not find a warehouse with id ${warehouseId}` });
      }

      const receipts = await this.importProductReceiptService.findAll(
        warehouseId,
      );
      return res.status(HttpStatus.OK).json(receipts);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async fetchImportReceipt(@Param('id') id: number, @Res() res: Response) {
    try {
      const receipt = await this.importProductReceiptService.findOne(id);
      if (!receipt) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find an import receipt with id ${id}`,
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
    @Body() data: UpdateImportProductReceiptDto,
    @Res() res: Response,
  ) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New import receipt information is required' });
    }

    try {
      const receipt = await this.importProductReceiptService.findOne(id);
      if (!receipt) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find an import receipt with id ${id}`,
        });
      }

      let warehouseManager;
      if (data.idNguoiLap.toString() != receipt.nguoiLap.id) {
        warehouseManager = await this.userService.findOne(
          data.idNguoiLap.toString(),
        );
        if (!warehouseManager) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: `Can not find a user with id ${data.idNguoiLap} to assign`,
          });
        }
      } else {
        warehouseManager = receipt.nguoiLap;
      }

      let warehouse;
      if (data.idKho != receipt.kho.id) {
        warehouse = await this.warehouseService.findOne(data.idKho.toString());
        if (!warehouse) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: `Can not find a warehouse with id ${data.idKho}`,
          });
        }
      } else {
        warehouse = receipt.kho;
      }

      for (const chiTiet of data.dsChiTietPhieuNhap) {
        const detail = await this.detailImportService.findOne(chiTiet.id);
        if (!detail) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: `Can not find a detail with id ${chiTiet.id}`,
          });
        }

        const product = await this.productService.findOne(chiTiet.idMatHang);
        if (!product) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: `Can not find a product with id ${chiTiet.idMatHang}`,
          });
        }

        detail.matHang = product;
        detail.soLuong = chiTiet.soLuong;
        detail.phieuNhapKho = receipt;
        await this.detailImportService.update(detail.id, detail);
      }

      const importReceiptData: PhieuNhapKho = {
        tongTien: data.tongTien,
        ghiChu: data.ghiChu,
        nguoiLap: warehouseManager,
        kho: warehouse,
      };

      const updatedReceipt = await this.importProductReceiptService.update(
        id,
        importReceiptData,
      );
      return res.status(HttpStatus.OK).json(updatedReceipt);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async deleteImportReceipt(@Param('id') id: number, @Res() res: Response) {
    try {
      const receipt = await this.importProductReceiptService.findOne(id);
      if (!receipt) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`Can not find a receipt with id ${id} to delete`);
      }

      for (const chiTiet of receipt.dsCTPhieuNhap) {
        const detail = await this.detailImportService.findOne(chiTiet.id);
        if (!detail) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: `Can not find a detail with id ${chiTiet.id}`,
          });
        }
        await this.detailImportService.remove(detail.id);
      }

      await this.importProductReceiptService
        .remove(id)
        .then(() =>
          res.status(HttpStatus.OK).send('Delete import receipt successfully'),
        );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
