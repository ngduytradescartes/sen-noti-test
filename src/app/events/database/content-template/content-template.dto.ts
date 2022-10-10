import { IsObject, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ContentTemplateDto {
  @IsObject()
  dappId: Types.ObjectId;

  @IsString()
  eventName: string;

  @IsString()
  subject: string;

  @IsString()
  conjunction: string;

  @IsString()
  object: string;

  @IsString()
  extraField: string;
}
