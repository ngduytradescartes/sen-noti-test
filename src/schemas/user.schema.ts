import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Dapp } from './dapp.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Dapp' })
  dappId: Dapp;

  @Prop({ type: String, required: true, unique: true })
  address: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
