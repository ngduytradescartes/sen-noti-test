import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ContentTemplate,
  ContentTemplateSchema,
} from 'src/schemas/content-template.schema';
import { Dapp, DappSchema } from 'src/schemas/dapp.schema';
import {
  NotificationSchema,
  Notification,
} from 'src/schemas/notification.schema';

import { Solana } from './adapters/solana/client';
import { ContentTemplateService } from './database/content-template/content-template.service';
import { DappService } from './database/dapp/dapp.service';
import { NotificationService } from './database/notification/notification.service';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';
import { BalansolService } from './logical/balansol.service';
import { FarmV2Service } from './logical/farmV2.service';
import { InterdaoService } from './logical/interdao.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dapp.name, schema: DappSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: ContentTemplate.name, schema: ContentTemplateSchema },
    ]),
  ],
  providers: [
    {
      provide: 'Solana',
      useClass: Solana,
    },
    EventsGateway,
    BalansolService,
    InterdaoService,
    FarmV2Service,
    EventsService,
    NotificationService,
    ContentTemplateService,
    DappService,
  ],
})
export class EventsModule {}
