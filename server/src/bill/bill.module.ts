import { CustomerModule } from './../customer/customer.module';
import { CounterModule } from './../counter/counter.module';
import { StoreModule } from './../store/store.module';
import { UserModule } from './../user/user.module';
import { CT_HOADON } from './entities/bill-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { BillService } from './service/bill.service';
import { BillController } from './bill.controller';
import { HoaDon } from './entities/bill.entity';
import { ProductModule } from 'src/product/product.module';
import { BillDetailService } from './service/bill-detail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HoaDon, CT_HOADON]),
    forwardRef(() => UserModule),
    forwardRef(() => CounterModule),
    forwardRef(() => ProductModule),
    forwardRef(() => StoreModule),
    forwardRef(() => CustomerModule),
  ],
  controllers: [BillController],
  providers: [BillService, BillDetailService],
  exports: [BillService],
})
export class BillModule {}
