import { Controller, Get, Query, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ParseLimitPipe } from 'src/pipelines/limit.pipe';
import { ParseOffsetPipe } from 'src/pipelines/offset.pipe';
import { TestService } from './test.service';

@Controller('/test')
export class TestController {
  constructor(private readonly service: TestService) {}
  @Get()
  async getTest(
    @Query('offset', ParseOffsetPipe) offset: number,
    @Query('limit', ParseLimitPipe) limit: number,
    @Query('search') search = '',
  ) {
    return this.service.getTests({ search, offset, limit });
  }
  @Post()
  async createTest(@Req() request: Request) {
    return this.service.newTest(request.body);
  }
}
