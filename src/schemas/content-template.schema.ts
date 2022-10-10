import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ContentTemplateDocument = ContentTemplate & Document;

@Schema()
export class ContentTemplate {
  @Prop({ type: Types.ObjectId, ref: 'Dapp' })
  dappId: Types.ObjectId;

  @Prop({ type: String, required: true })
  eventName: string;

  @Prop({ type: String, required: true })
  subject: string;

  @Prop({ type: String, required: true })
  conjunction: string;

  @Prop({ type: String, required: true })
  object: string;

  @Prop({ type: String })
  extraField: string;
}

export const ContentTemplateSchema =
  SchemaFactory.createForClass(ContentTemplate);
