import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';

import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notification.schema';
import { MAX_LIMIT } from 'src/pipelines/limit.pipe';
import { MIN_OFFSET } from 'src/pipelines/offset.pipe';
import { EnvironmentVariables } from 'src/config';
import { NotificationDto } from './notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private config: ConfigService<EnvironmentVariables>,
  ) {}

  dbProjection = this.config.get('mongodb.projection', { infer: true });

  async getNotifications({
    filter = {},
    search = '',
    offset = MIN_OFFSET,
    limit = MAX_LIMIT,
  }: {
    filter?: object;
    search?: string;
    offset?: number;
    limit?: number;
  }) {
    const cond = search ? { ...filter, $text: { $search: search } } : filter;
    console.log('condss: ', cond);
    const notifications = await this.notificationModel
      .find(cond)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate('dappId')
      .exec();
    console.log('notifications: ', notifications);
    return notifications;
  }

  async updateNotification(_id: string, data: NotificationDto) {
    console.log('data ossss', _id, data);
    const newNotification = await this.notificationModel
      .findOneAndUpdate({ _id }, data, { new: true })
      .exec();
    return newNotification;
  }

  async newNotification(notification: NotificationDto) {
    const newNotification = await new this.notificationModel({
      ...notification,
    }).save();
    return newNotification;
  }
}
