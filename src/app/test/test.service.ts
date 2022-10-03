import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';

import { Test, TestDocument } from 'src/schemas/test.schema';
import { MAX_LIMIT } from 'src/pipelines/limit.pipe';
import { MIN_OFFSET } from 'src/pipelines/offset.pipe';
import { EnvironmentVariables } from 'src/config';
import { TestDto } from './test.dto';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test.name) private testModel: Model<TestDocument>,
    private config: ConfigService<EnvironmentVariables>,
  ) {}

  dbProjection = this.config.get('mongodb.projection', { infer: true });

  async getTests({
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
    const dapps = await this.testModel
      .find(cond, this.dbProjection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
    return dapps;
  }

  async newTest(dapp: TestDto) {
    const newDapp = await new this.testModel({ ...dapp }).save();
    return newDapp;
  }
}
