import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Dapp } from './dapp.schema';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Dapp' })
  dappId: Dapp;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Boolean, default: false })
  seen: boolean;

  @Prop({ type: Date, required: true })
  time: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
