import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { StoreModule } from './store/store.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { SupplierModule } from './supplier/supplier.module';
import { CounterModule } from './counter/counter.module';
import { ProductModule } from './product/product.module';
import { ProducerModule } from './producer/producer.module';
import { AuthModule } from './auth/auth.module';
import { ImportProductReceiptModule } from './import-product-receipt/import-product-receipt.module';
import { ExportProductReceiptModule } from './export-product-receipt/export-product-receipt.module';
import { BillModule } from './bill/bill.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    // make variables in .env global and accessible to use
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://fzlxlrverfgkre:f12d36e5dd11876d84d02c88c6a00f7bb4c03e9c317d14e978667f2d23660932@ec2-52-18-185-208.eu-west-1.compute.amazonaws.com:5432/darer5ral7fbo4',
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    UserModule,

    StoreModule,

    WarehouseModule,

    SupplierModule,

    CounterModule,

    ProductModule,

    ProducerModule,

    AuthModule,

    ImportProductReceiptModule,

    ExportProductReceiptModule,

    BillModule,

    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
