import { KhachHang } from './entities/customer.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(KhachHang)
    private readonly customerRepo: Repository<KhachHang>,
  ) {}

  create(data: KhachHang) {
    return this.customerRepo.save(data);
  }

  findAll() {
    return this.customerRepo.find({
      relations: ['dsHoaDon'],
    });
  }

  findOne(id: number) {
    return this.customerRepo.findOne(id, {
      relations: ['dsHoaDon'],
    });
  }

  async update(id: number, data) {
    const response = await this.customerRepo
      .createQueryBuilder('customer')
      .update(data)
      .where('id = :id', { id: id })
      .returning('*')
      .updateEntity(true)
      .execute();

    const updatedCustomer = response.raw[0] as KhachHang;
    return updatedCustomer;
  }

  delete(id: number) {
    return this.customerRepo.delete(id);
  }
}
