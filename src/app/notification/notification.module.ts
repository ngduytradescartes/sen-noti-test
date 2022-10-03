import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  NotificationSchema,
  Notification,
} from 'src/schemas/notification.schema';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
