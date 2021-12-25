import { KhachHang } from './entities/customer.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CustomerService } from './service/customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Response } from 'express';
import { CustomerDetailService } from './service/customer-detail.service';
import { CT_KhachHang } from './entities/customer-detail.entity';

@ApiTags('customer')
@Controller('customer')
// @UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService, 
    private readonly customerDetailService: CustomerDetailService
  ) {}

  @Post()
  async addCustomer(@Body() data: KhachHang, @Res() res: Response) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New customer information is required' });
    }

    try {
      const {dsCTKhachHang, dsHoaDon, ...customerData} = data
      const newCustomer = await this.customerService.create(customerData);

      for (const chiTiet of dsCTKhachHang) {
        const newDetail: CT_KhachHang = {
          ...chiTiet, // hoTen, gioiTinh, ngaySinh (con)
          khachHang: newCustomer,
        }
        await this.customerDetailService.create(newDetail);
      }

      return res.status(HttpStatus.CREATED).json(newCustomer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async fetchAllCustomers(@Res() res: Response) {
    try {
      const customers = await this.customerService.findAll();
      return res.status(HttpStatus.OK).json(customers);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async fetchCustomer(@Param('id') id: number, @Res() res: Response) {
    try {
      const customer = await this.customerService.findOne(id);
      if (!customer) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`Can not find a customer with id ${id}`);
      }
      return res.status(HttpStatus.OK).json(customer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async updateCustomer(
    @Param('id') id: number,
    @Body() data: KhachHang,
    @Res() res: Response,
  ) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New customer information is required' });
    }

    try {
      const {dsCTKhachHang, dsHoaDon, ...customerData} = data
      const customer = await this.customerService.findOne(id);
      if (!customer) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a customer with id ${id}`,
        });
      }

      customer.dsCTKhachHang.forEach(async (ct) => {
        await this.customerDetailService.delete(ct.id);
      });

      dsCTKhachHang.forEach(async (chiTiet) => {
        const newDetail: CT_KhachHang = {
          ...chiTiet, // hoTen, gioiTinh, ngaySinh (con)
          khachHang: customer,
        }
        await this.customerDetailService.create(newDetail);
      });

      const updatedCustomer = await this.customerService.update(id, customerData);
      return res.status(HttpStatus.OK).json(updatedCustomer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: number, @Res() res: Response) {
    try {
      const customer = await this.customerService.findOne(id);
      if (!customer) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`Can not find a customer with id ${id} to delete`);
      }

      if(customer.dsHoaDon.length !== 0) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(`Can not delete a customer, list bills not empty`);
      }

      for (const chiTiet of customer.dsCTKhachHang) {
        await this.customerDetailService.delete(chiTiet.id);
      }

      await this.customerService
        .delete(id)
        .then(() =>
          res.status(HttpStatus.OK).send('Delete customer successfully'),
        );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
