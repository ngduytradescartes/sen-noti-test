import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';

import {
  Subscription,
  SubscriptionDocument,
} from 'src/schemas/subscription.schema';
import { MAX_LIMIT } from 'src/pipelines/limit.pipe';
import { MIN_OFFSET } from 'src/pipelines/offset.pipe';
import { EnvironmentVariables } from 'src/config';
import { SubscriptionDto } from './subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    private config: ConfigService<EnvironmentVariables>,
  ) {}

  dbProjection = this.config.get('mongodb.projection', { infer: true });

  async getSubscriptions({
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
    const subscriptions = await this.subscriptionModel
      .find(cond, this.dbProjection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
    return subscriptions;
  }

  async newSubscription(dapp: SubscriptionDto) {
    const newSubscription = await new this.subscriptionModel({
      ...dapp,
    }).save();
    return newSubscription;
  }
}
