import { Controller, Get, Query, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ParseLimitPipe } from 'src/pipelines/limit.pipe';
import { ParseOffsetPipe } from 'src/pipelines/offset.pipe';
import { NotificationService } from './notification.service';

@Controller('/notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}
  @Get()
  async getNotification(
    @Query('offset', ParseOffsetPipe) offset: number,
    @Query('limit', ParseLimitPipe) limit: number,
    @Query('search') search = '',
  ) {
    return this.service.getNotifications({ search, offset, limit });
  }

  @Post()
  async createNotification(@Req() request: Request) {
    return this.service.newNotification(request.body);
  }
}
