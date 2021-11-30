import { CreateDetailExportDto } from './../dto/create-detail-export.dto';
import { CT_PhieuXuatKho } from '../entities/detail-export-receipt.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExportProductReceiptDto } from '../dto/create-export-product-receipt.dto';
import { UpdateExportProductReceiptDto } from '../dto/update-export-product-receipt.dto';
import { Repository } from 'typeorm';

@Injectable()
export class DetailExportReceiptService {
  constructor(
    @InjectRepository(CT_PhieuXuatKho)
    private readonly detailExportReceiptRepo: Repository<CT_PhieuXuatKho>,
  ) {}

  create(newDetailExport) {
    return this.detailExportReceiptRepo.save(newDetailExport);
  }

  findAll() {
    return this.detailExportReceiptRepo.find({
      relations: ['matHang', 'phieuXuatKho'],
    });
  }

  findOne(id: number) {
    return this.detailExportReceiptRepo.findOne(id, {
      relations: ['matHang', 'phieuXuatKho'],
    });
  }

  async update(id: number, data: CT_PhieuXuatKho) {
    const response = await this.detailExportReceiptRepo
      .createQueryBuilder('detailExport')
      .update(data)
      .where('id = :id', { id: id })
      .returning('*')
      .updateEntity(true)
      .execute();

    const updatedReceipt = response.raw[0] as CT_PhieuXuatKho;
    return updatedReceipt;
  }

  remove(id: number) {
    return this.detailExportReceiptRepo.delete(id);
  }
}
