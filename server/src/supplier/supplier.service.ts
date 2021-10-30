import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { NhaCungCap } from './entities/supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(NhaCungCap)
    private readonly supplierRepository: Repository<NhaCungCap>,
  ) {}

  create(data: NhaCungCap) {
    return this.supplierRepository.save(data);
  }

  findAll() {
    return this.supplierRepository.find();
  }

  findOne(id: string) {
    return this.supplierRepository.findOne(id);
  }

  async update(id: string, data: NhaCungCap) {
    const response = await this.supplierRepository
      .createQueryBuilder('supplier')
      .update(data)
      .where('id = :id', { id: id })
      .returning(['id', 'tenNCC', 'diaChi', 'sdt'])
      .updateEntity(true)
      .execute();

    const updatedSupplier = response.raw[0] as NhaCungCap;
    return updatedSupplier;
  }

  delete(id: string) {
    return this.supplierRepository.delete(id);
  }
}
