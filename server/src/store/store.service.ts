import { NguoiDung } from './../user/entities/user.entity';
import { CuaHang } from './entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';

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
    return await this.storeRepository.find({
      relations: ['chuCuaHang', 'dsQuay', 'dsNhanVien', 'dsNhanVien.quay'],
    });
  }

  async findOne(id: string) {
    return await this.storeRepository.findOne(id, {
      relations: ['chuCuaHang', 'dsQuay', 'dsNhanVien'],
    });
  }

  async update(id: string, data: CuaHang) {
    const response = await this.storeRepository
      .createQueryBuilder('store')
      .leftJoin('store.dsQuay', 'counter')
      .update(data)
      .where('id = :id', { id: id })
      .returning('*')
      .updateEntity(true)
      .execute();

    const updatedStore = response.raw[0] as CuaHang;
    return updatedStore;
  }

  async updateV2(store: CuaHang): Promise<UpdateResult> {
    return await this.storeRepository.update(store.id, store);
  }

  remove(id: string) {
    return this.storeRepository.delete(id);
  }
}
