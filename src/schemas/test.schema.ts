import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestDocument = Test & Document;

@Schema()
export class Test {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop()
  age: string;

  @Prop()
  breed: string;
}

export const TestSchema = SchemaFactory.createForClass(Test);
