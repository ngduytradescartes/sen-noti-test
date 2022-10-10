import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from 'src/config';
import { TestModule } from './test/test.module';
import { DappModule } from './events/database/dapp/dapp.module';
import { NotificationModule } from './events/database/notification/notification.module';
import { UserModule } from './events/database/user/user.module';
import { SubscriptionModule } from './events/database/subscription/subscription.module';
import { EventsModule } from 'src/app/events/events.module';
import { AppController } from './app.controller';
import { ContentTemplateModule } from './events/database/content-template/content-template.module';

@Module({
  imports: [
    EventsModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(
      'mongodb+srv://exchange_data_app:vu1vlCFmtJEuEAvq@cluster0.chtee.mongodb.net/?retryWrites=true&w=majority',
    ),
    TestModule,
    DappModule,
    NotificationModule,
    UserModule,
    SubscriptionModule,
    ContentTemplateModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
