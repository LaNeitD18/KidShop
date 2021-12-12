import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CT_HOADON } from './entities/bill-detail.entity';
import { HoaDon } from './entities/bill.entity';
import { CounterService } from './../counter/counter.service';
import { StoreService } from './../store/store.service';
import { ProductService } from './../product/services/product.service';
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
  UseGuards,
} from '@nestjs/common';
import { BillService } from './service/bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Response } from 'express';
import { BillDetailService } from './service/bill-detail.service';
import { CustomerService } from 'src/customer/customer.service';

@ApiTags('bill')
@Controller('bill')
@UseGuards(JwtAuthGuard)
export class BillController {
  constructor(
    private readonly billService: BillService,
    private readonly billDetailService: BillDetailService,
    private readonly userService: UserService,
    private readonly counterService: CounterService,
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
    private readonly customerService: CustomerService,
  ) {}

  @Post()
  async createBill(@Body() data: CreateBillDto, @Res() res: Response) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New bill information is required' });
    }

    try {
      const creator = await this.userService.findOne(
        data.idNguoiLap.toString(),
      );
      if (!creator) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a user with id ${data.idNguoiLap} to assign`,
        });
      }

      const customer = await this.customerService.findOne(data.idKhachHang);
      if (!customer) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a customer with id ${data.idKhachHang} to assign`,
        });
      }

      const counter = await this.counterService.findOne(data.idQuay.toString());
      if (!counter) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: `Can not find a counter with id ${data.idQuay}` });
      }

      const billData: HoaDon = {
        tongHoaDon: data.tongHoaDon,
        nguoiLap: creator,
        quay: counter,
        khachHang: customer,
      };
      const newBill = await this.billService.create(billData);

      for (const chiTiet of data.dsCTHoaDon) {
        const product = await this.productService.findOne(chiTiet.idMatHang);
        if (!product) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: `Can not find a product with id ${chiTiet.idMatHang}`,
          });
        }
        const newBillDetail: CT_HOADON = {
          soLuong: chiTiet.soLuong,
          tongTien: chiTiet.tongTien,
          giamGia: chiTiet.giamGia,
          matHang: product,
          hoaDon: newBill,
        };
        await this.billDetailService.create(newBillDetail);
      }

      return res.status(HttpStatus.CREATED).json(newBill);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('all/:storeId')
  async fetchAllBills(@Param('storeId') storeId: number, @Res() res: Response) {
    try {
      const store = await this.storeService.findOne(storeId.toString());
      if (!store) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: `Can not find a store with id ${store}` });
      }

      const bills = await this.billService.findAll(storeId);
      return res.status(HttpStatus.OK).json(bills);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async fetchBill(@Param('id') id: number, @Res() res: Response) {
    try {
      const bill = await this.billService.findOne(id);
      if (!bill) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a bill with id ${id}`,
        });
      }
      return res.status(HttpStatus.OK).json(bill);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async updateBill(
    @Param('id') id: number,
    @Body() data: UpdateBillDto,
    @Res() res: Response,
  ) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New bill information is required' });
    }

    try {
      const bill = await this.billService.findOne(id);
      if (!bill) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a bill with id ${id}`,
        });
      }

      let creator;
      if (data.idNguoiLap.toString() != bill.nguoiLap.id) {
        creator = await this.userService.findOne(data.idNguoiLap.toString());
        if (!creator) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: `Can not find a user with id ${data.idNguoiLap} to assign`,
          });
        }
      } else {
        creator = bill.nguoiLap;
      }

      let customner;
      if (data.idKhachHang != bill.khachHang.id) {
        customner = await this.customerService.findOne(data.idKhachHang);
        if (!customner) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: `Can not find a customer with id ${data.idKhachHang} to assign`,
          });
        }
      } else {
        customner = bill.khachHang;
      }

      let counter;
      if (data.idQuay != bill.quay.id) {
        counter = await this.counterService.findOne(data.idQuay.toString());
        if (!counter) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: `Can not find a counter with id ${data.idQuay}`,
          });
        }
      } else {
        counter = bill.quay;
      }

      for (const chiTiet of data.dsCTHoaDon) {
        const detail = await this.billDetailService.findOne(chiTiet.id);
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
        detail.hoaDon = bill;
        await this.billDetailService.update(detail.id, detail);
      }

      const billData: HoaDon = {
        tongHoaDon: data.tongHoaDon,
        nguoiLap: creator,
        khachHang: customner,
        quay: counter,
      };

      const updatedBill = await this.billService.update(id, billData);
      return res.status(HttpStatus.OK).json(updatedBill);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async deleteBill(@Param('id') id: number, @Res() res: Response) {
    try {
      const bill = await this.billService.findOne(id);
      if (!bill) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`Can not find a bill with id ${id} to delete`);
      }

      for (const chiTiet of bill.dsCTHoaDon) {
        const detail = await this.billDetailService.findOne(chiTiet.id);
        if (!detail) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: `Can not find a detail with id ${chiTiet.id}`,
          });
        }
        await this.billDetailService.delete(detail.id);
      }

      await this.billService
        .delete(id)
        .then(() => res.status(HttpStatus.OK).send('Delete bill successfully'));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
