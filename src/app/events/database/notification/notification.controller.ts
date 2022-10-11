import {
  Controller,
  Get,
  Query,
  Post,
  Req,
  Patch,
  Param,
} from '@nestjs/common';
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
  @Patch('/:id')
  async updateNotification(
    @Req() request: Request,
    @Param() params: { id: string },
  ) {
    return this.service.updateNotification(params.id, request.body);
  }
  @Patch()
  async updateNotifications(@Req() request: Request) {
    return this.service.updateNotifications(request.body);
  }
  @Post()
  async createNotification(@Req() request: Request) {
    return this.service.newNotification(request.body);
  }
}
