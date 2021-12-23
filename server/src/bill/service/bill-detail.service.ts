import { CT_HOADON } from './../entities/bill-detail.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BillDetailService {
  constructor(
    @InjectRepository(CT_HOADON)
    private readonly billDetailRepo: Repository<CT_HOADON>,
  ) {}

  create(newBillDetail) {
    return this.billDetailRepo.save(newBillDetail);
  }

  findAll() {
    return this.billDetailRepo.find({
      relations: ['matHang', 'hoaDon'],
    });
  }

  findOne(id: number) {
    return this.billDetailRepo.findOne(id, {
      relations: ['matHang', 'hoaDon'],
    });
  }

  async update(id: number, data: CT_HOADON) {
    const response = await this.billDetailRepo
      .createQueryBuilder('billDetail')
      .update(data)
      .where('id = :id', { id: id })
      .returning('*')
      .updateEntity(true)
      .execute();

    const updatedReceipt = response.raw[0] as CT_HOADON;
    return updatedReceipt;
  }

  delete(id: number) {
    return this.billDetailRepo.delete(id);
  }
}
