import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Dapp } from './dapp.schema';
import { User } from './user.schema';

export type SubscriptionDocument = Subscription & Document;

@Schema()
export class Subscription {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Dapp' })
  dappId: Dapp;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Boolean, default: false })
  seen: boolean;

  @Prop({ type: Date, required: true })
  time: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
