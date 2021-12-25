import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CT_KhachHang } from '../entities/customer-detail.entity';

@Injectable()
export class CustomerDetailService {
  constructor(
    @InjectRepository(CT_KhachHang)
    private readonly customerdetailRepo: Repository<CT_KhachHang>,
  ) {}

  create(data: CT_KhachHang) {
    return this.customerdetailRepo.save(data);
  }

  findAll() {
    return this.customerdetailRepo.find({
      relations: ['khachHang'],
    });
  }

  findOne(id: number) {
    return this.customerdetailRepo.findOne(id, {
      relations: ['khachHang'],
    });
  }

  async update(id: number, data) {
    const response = await this.customerdetailRepo
      .createQueryBuilder('customerDetail')
      .update(data)
      .where('id = :id', { id: id })
      .returning('*')
      .updateEntity(true)
      .execute();

    const updatedCustomer = response.raw[0] as CT_KhachHang;
    return updatedCustomer;
  }

  delete(id: number) {
    return this.customerdetailRepo.delete(id);
  }
}
