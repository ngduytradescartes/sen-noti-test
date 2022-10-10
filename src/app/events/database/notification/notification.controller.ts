import { Controller, Get, Query, Post, Req, Patch } from '@nestjs/common';
import { Request } from 'express';
import { ParseLimitPipe } from 'src/pipelines/limit.pipe';
import { ParseOffsetPipe } from 'src/pipelines/offset.pipe';
import { NotificationService } from './notification.service';

@Controller('/notification')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}
  @Get('/all')
  async getNotifications(
    @Query('offset', ParseOffsetPipe) offset: number,
    @Query('limit', ParseLimitPipe) limit: number,
    @Query('search') search = '',
  ) {
    return this.service.getNotifications({ search, offset, limit });
  }
  @Patch()
  async getNotification(@Req() request: Request) {
    return this.service.updateNotification(
      request.body.id,
      request.body.content,
    );
  }
  @Post()
  async createNotification(@Req() request: Request) {
    return this.service.newNotification(request.body);
  }
}
