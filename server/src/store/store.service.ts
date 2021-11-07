import { CuaHang } from './entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Repository, UpdateResult } from 'typeorm';
import { NguoiDung } from 'src/user/entities/user.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(CuaHang)
    private readonly storeRepository: Repository<CuaHang>,
  ) {}

  async create(newStore: CuaHang) {
    return await this.storeRepository.save(newStore);
  }

  async findAll() {
    return await this.storeRepository.find({ relations: ['chuCuaHang'] });
  }

  async findOne(id: string) {
    return await this.storeRepository.findOne(id, {
      relations: ['chuCuaHang'],
    });
  }

  async update(id: string, data: CuaHang) {
    const response = await this.storeRepository
      .createQueryBuilder('store')
      .update(data)
      .where('id = :id', { id: id })
      .returning('*')
      .updateEntity(true)
      .execute();

    const updatedStore = response.raw[0] as CuaHang;
    return updatedStore;
  }

  remove(id: string) {
    return this.storeRepository.delete(id);
  }
}
