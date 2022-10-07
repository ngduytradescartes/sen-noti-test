import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DappDocument = Dapp & Document;

@Schema()
export class Dapp {
  @Prop({ type: String, required: true, unique: true })
  address: string;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  logo: string;
}

export const DappSchema = SchemaFactory.createForClass(Dapp);
