import { Controller, Get, Query, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { ParseLimitPipe } from 'src/pipelines/limit.pipe';
import { ParseOffsetPipe } from 'src/pipelines/offset.pipe';
import { SubscriptionService } from './subscription.service';

@Controller('/subscription')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}
  @Get()
  async getSubscription(
    @Query('offset', ParseOffsetPipe) offset: number,
    @Query('limit', ParseLimitPipe) limit: number,
    @Query('search') search = '',
  ) {
    return this.service.getSubscriptions({ search, offset, limit });
  }
  @Post()
  async createSubscription(@Req() request: Request) {
    return this.service.newSubscription(request.body);
  }
}
