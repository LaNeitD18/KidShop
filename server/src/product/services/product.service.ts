import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
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
    return await this.productRepository.find({ relations: ['chuCuaHang'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
