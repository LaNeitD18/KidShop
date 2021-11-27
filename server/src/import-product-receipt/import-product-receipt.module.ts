import { WarehouseModule } from './../warehouse/warehouse.module';
import { DetailImportReceiptService } from './service/detail-import-receipt.service';
import { CT_PhieuNhapKho } from './entities/detail-import-receipt';
import { ProductModule } from './../product/product.module';
import { UserModule } from './../user/user.module';
import { PhieuNhapKho } from './entities/import-product-receipt.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { ImportProductReceiptService } from './service/import-product-receipt.service';
import { ImportProductReceiptController } from './import-product-receipt.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhieuNhapKho, CT_PhieuNhapKho]),
    forwardRef(() => UserModule),
    forwardRef(() => WarehouseModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [ImportProductReceiptController],
  providers: [ImportProductReceiptService, DetailImportReceiptService],
  exports: [ImportProductReceiptService],
})
export class ImportProductReceiptModule {}
