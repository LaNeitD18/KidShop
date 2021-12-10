import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kho } from './entities/warehouse.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Kho)
    private readonly warehouseRepository: Repository<Kho>,
  ) {}

  create(data: Kho) {
    return this.warehouseRepository.save(data);
  }

  findAll() {
    return this.warehouseRepository.find({ relations: ['quanLyKho'] });
  }

  findOne(id: string) {
    return this.warehouseRepository.findOne(id, { relations: ['quanLyKho'] });
  }

  async update(id: string, data: Kho) {
    const response = await this.warehouseRepository
      .createQueryBuilder('wh')
      .update(data)
      .where('id = :id', { id: id })
      .returning(['id', 'diaChi', 'sdt'])
      .updateEntity(true)
      .execute();

    const updatedWarehouse = response.raw[0] as Kho;
    return updatedWarehouse;
  }

  delete(id: string) {
    return this.warehouseRepository.delete(id);
  }
}
