import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from 'src/users/users.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}
  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: User,
  ) {
    return this.reportService.createReport(createReportDto, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async approveReport(
    @Param('id') id: string,
    @Body() approveReportDto: ApproveReportDto,
  ) {
    return this.reportService.changeApproval(id, approveReportDto.approved);
  }
  @Get()
  async getEstimate(@Query() query: GetEstimateDto) {
    return this.reportService.getEstimate(query);
  }
}
