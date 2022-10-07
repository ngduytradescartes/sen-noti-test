import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';

import { Dapp, DappDocument } from 'src/schemas/dapp.schema';
import { MAX_LIMIT } from 'src/pipelines/limit.pipe';
import { MIN_OFFSET } from 'src/pipelines/offset.pipe';
import { EnvironmentVariables } from 'src/config';
import { DappDto } from './dapp.dto';

@Injectable()
export class DappService {
  constructor(
    @InjectModel(Dapp.name) private dappModel: Model<DappDocument>,
    private config: ConfigService<EnvironmentVariables>,
  ) {}

  dbProjection = this.config.get('mongodb.projection', { infer: true });

  async getDapps({
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
    const dapps = await this.dappModel
      .find(cond, this.dbProjection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
    return dapps;
  }

  async getDapp(query: { name?: string; address: string }) {
    return await this.dappModel.findOne(query).exec();
  }

  async newDapp(dapp: DappDto) {
    const newDapp = await new this.dappModel({ ...dapp }).save();
    return newDapp;
  }
}
