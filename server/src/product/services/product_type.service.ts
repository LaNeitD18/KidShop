import { LoatMatHang } from './../entities/product_type.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(LoatMatHang)
    private readonly productTypeRepository: Repository<LoatMatHang>,
  ) {}

  create(data: LoatMatHang) {
    return this.productTypeRepository.save(data);
  }

  findAll() {
    return this.productTypeRepository.find();
  }

  findOne(id: string) {
    return this.productTypeRepository.findOne(id);
  }

  async update(id: string, data: LoatMatHang) {
    const response = await this.productTypeRepository
      .createQueryBuilder('type')
      .update(data)
      .where('id = :id', { id: id })
      .returning(['id', 'tenLoaiMH'])
      .updateEntity(true)
      .execute();

    const updatedSupplier = response.raw[0] as LoatMatHang;
    return updatedSupplier;
  }

  delete(id: string) {
    return this.productTypeRepository.delete(id);
  }
}
