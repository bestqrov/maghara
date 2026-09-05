import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { AdminUsersService } from './admin-users.service';
import { ListUsersDto } from './dto/list-users.dto';

@UseGuards(AdminJwtGuard)
@Controller('admin-users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  list(@Query() dto: ListUsersDto) {
    return this.adminUsersService.list(dto.search, dto.page ?? 1, dto.limit ?? 25);
  }

  @Get('export')
  async export(@Res() res: Response) {
    const csv = await this.adminUsersService.exportCsv();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="members.csv"');
    res.send(csv);
  }
}
