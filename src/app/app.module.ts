import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { AppController } from '../app.controller';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from 'src/config';
import { TestModule } from './test/test.module';
import { DappModule } from './dapp/dapp.module';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './user/user.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    // MongooseModule.forRootAsync({
    //   useClass: MongooseConfigService,
    // }),
    MongooseModule.forRoot(
      'mongodb+srv://exchange_data_app:vu1vlCFmtJEuEAvq@cluster0.chtee.mongodb.net/?retryWrites=true&w=majority',
    ),
    TestModule,
    DappModule,
    NotificationModule,
    UserModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
