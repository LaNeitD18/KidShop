import { DetailExportReceiptService } from './service/detail-export-receipt.service';
import { StoreModule } from './../store/store.module';
import { ProductModule } from './../product/product.module';
import { WarehouseModule } from './../warehouse/warehouse.module';
import { UserModule } from './../user/user.module';
import { CT_PhieuXuatKho } from './entities/detail-export-receipt.entity';
import { PhieuXuatKho } from './entities/export-product-receipt.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { ExportProductReceiptService } from './service/export-product-receipt.service';
import { ExportProductReceiptController } from './export-product-receipt.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhieuXuatKho, CT_PhieuXuatKho]),
    forwardRef(() => UserModule),
    forwardRef(() => WarehouseModule),
    forwardRef(() => ProductModule),
    forwardRef(() => StoreModule),
  ],
  controllers: [ExportProductReceiptController],
  providers: [ExportProductReceiptService, DetailExportReceiptService],
  exports: [ExportProductReceiptService],
})
export class ExportProductReceiptModule {}
