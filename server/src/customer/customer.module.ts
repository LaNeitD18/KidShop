import { KhachHang } from './entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CustomerService } from './service/customer.service';
import { CustomerController } from './customer.controller';
import { CT_KhachHang } from './entities/customer-detail.entity';
import { CustomerDetailService } from './service/customer-detail.service';

@Module({
  imports: [TypeOrmModule.forFeature([KhachHang, CT_KhachHang])],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerDetailService],
  exports: [CustomerService],
})
export class CustomerModule {}
