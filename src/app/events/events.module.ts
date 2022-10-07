import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dapp, DappSchema } from 'src/schemas/dapp.schema';

import { Solana } from './adapters/solana/client';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';
import { BalansolService } from './logical/balansol.service';
import { FarmV2Service } from './logical/farmV2.service';
import { InterdaoService } from './logical/interdao.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dapp.name, schema: DappSchema }]),
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
    String,
  ],
})
export class EventsModule {}
