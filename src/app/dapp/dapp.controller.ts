import { Controller, Get, Query, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ParseLimitPipe } from 'src/pipelines/limit.pipe';
import { ParseOffsetPipe } from 'src/pipelines/offset.pipe';
import { DappService } from './dapp.service';

@Controller('/dapp')
export class DappController {
  constructor(private readonly service: DappService) {}
  @Get()
  async getDapp(
    @Query('offset', ParseOffsetPipe) offset: number,
    @Query('limit', ParseLimitPipe) limit: number,
    @Query('search') search = '',
  ) {
    return this.service.getDapps({ search, offset, limit });
  }
  @Post()
  async createDapp(@Req() request: Request) {
    return this.service.newDapp(request.body);
  }
}
