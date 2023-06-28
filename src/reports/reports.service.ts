import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/users.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async createReport(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const reportExists = await this.repo.findOne({
      where: { id: parseInt(id) },
    });

    if (!reportExists) {
      throw new NotFoundException('report not found');
    }
    reportExists.approved = approved;
    return this.repo.save(reportExists);
  }
  async getEstimate({
    make,
    model,
    longitude,
    latitude,
    year,
    mileage,
  }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make=:make', { make })
      .andWhere('model=:model', { model })
      .andWhere('longitude-:longitude BETWEEN -5 AND 5', { longitude })
      .andWhere('latitude-:latitude BETWEEN -5 AND 5', { latitude })
      .andWhere('year-:year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage-:mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
