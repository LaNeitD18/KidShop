import { PhieuNhapKho } from '../entities/import-product-receipt.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateImportProductReceiptDto } from '../dto/create-import-product-receipt.dto';
import { UpdateImportProductReceiptDto } from '../dto/update-import-product-receipt.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ImportProductReceiptService {
  constructor(
    @InjectRepository(PhieuNhapKho)
    private readonly importReceiptRepo: Repository<PhieuNhapKho>,
  ) {}

  create(newImportReceipt: PhieuNhapKho) {
    return this.importReceiptRepo.save(newImportReceipt);
  }

  findAll() {
    return this.importReceiptRepo.find({ relations: ['kho', 'nguoiLap'] });
  }

  findOne(id: number) {
    return this.importReceiptRepo.findOne(id, {
      relations: ['kho', 'nguoiLap', 'dsCTPhieuNhap'],
    });
  }

  async update(id: number, data: UpdateImportProductReceiptDto) {
    const response = await this.importReceiptRepo
      .createQueryBuilder('imReceipt')
      .update(data)
      .where('id = :id', { id: id })
      .returning('*')
      .updateEntity(true)
      .execute();

    const updatedReceipt = response.raw[0] as PhieuNhapKho;
    return updatedReceipt;
  }

  remove(id: number) {
    return this.importReceiptRepo.delete(id);
  }
}
