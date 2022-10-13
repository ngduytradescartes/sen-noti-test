import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';

import { BalansolService } from './logical/balansol.service';
import { FarmV2Service } from './logical/farmV2.service';
import { InterdaoService } from './logical/interdao.service';
import { EnvironmentVariables } from 'src/config';
import { Dapp, DappDocument } from 'src/schemas/dapp.schema';

@Injectable()
export class EventsService {
  constructor(
    private balansolService: BalansolService,
    private farmV2Service: FarmV2Service,
    private interdaoService: InterdaoService,
    @InjectModel(Dapp.name) private dappModel: Model<DappDocument>,
    private config: ConfigService<EnvironmentVariables>,
  ) {}

  dbProjection = this.config.get('mongodb.projection', { infer: true });

  //TODO: Gather dapp services into a factory
  async addEventListeners(socket: Socket) {
    this.balansolService.addEventListeners(socket);
    this.interdaoService.addEventListeners(socket);
    this.farmV2Service.addEventListeners(socket);
  }

  removeEventListeners() {
    this.balansolService.removeEventListeners();
    this.farmV2Service.removeEventListeners();
    this.interdaoService.removeEventListeners();
  }
}
