import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatHang } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(MatHang)
    private readonly productRepository: Repository<MatHang>,
  ) {}

  async create(newProduct: MatHang) {
    return await this.productRepository.save(newProduct);
  }

  async findAll() {
    return await this.productRepository.find({ relations: ['nhaSX', 'nhaCC'] });
  }

  async findOne(id: number) {
    return await this.productRepository.findOne(id, {
      relations: ['nhaSX', 'nhaCC'],
    });
  }

  async update(id: number, data: MatHang) {
    const response = await this.productRepository
      .createQueryBuilder('product')
      .update(data)
      .where('id = :id', { id })
      .returning('*')
      .updateEntity(true)
      .execute();

    const updatedProduct = response.raw[0] as MatHang;
    return updatedProduct;
  }

  async remove(id: number) {
    return this.productRepository.delete(id);
  }
}
