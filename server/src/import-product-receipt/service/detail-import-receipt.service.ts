import { CreateDetailImportDto } from './../dto/create-detail-import.dto';
import { CT_PhieuNhapKho } from './../entities/detail-import-receipt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateImportProductReceiptDto } from '../dto/create-import-product-receipt.dto';
import { UpdateImportProductReceiptDto } from '../dto/update-import-product-receipt.dto';
import { Repository } from 'typeorm';

@Injectable()
export class DetailImportReceiptService {
  constructor(
    @InjectRepository(CT_PhieuNhapKho)
    private readonly detailImportReceiptRepo: Repository<CT_PhieuNhapKho>,
  ) {}

  create(newDetailImport) {
    return this.detailImportReceiptRepo.save(newDetailImport);
  }

  findAll() {
    return this.detailImportReceiptRepo.find({
      relations: ['matHang', 'phieuNhapKho'],
    });
  }

  findOne(id: number) {
    return this.detailImportReceiptRepo.findOne(id, {
      relations: ['matHang', 'phieuNhapKho'],
    });
  }

  async update(id: number, data: CT_PhieuNhapKho) {
    const response = await this.detailImportReceiptRepo
      .createQueryBuilder('detailImport')
      .update(data)
      .where('id = :id', { id: id })
      .returning('*')
      .updateEntity(true)
      .execute();

    const updatedReceipt = response.raw[0] as CT_PhieuNhapKho;
    return updatedReceipt;
  }

  remove(id: number) {
    return this.detailImportReceiptRepo.delete(id);
  }
}
