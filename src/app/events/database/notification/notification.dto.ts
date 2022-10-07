import { IsString, IsObject, IsBoolean, IsDate } from 'class-validator';
import { Types } from 'mongoose';

export class NotificationDto {
  @IsObject()
  dappId: Types.ObjectId;

  @IsString()
  name: string;

  @IsString()
  content: string;

  @IsBoolean()
  seen: boolean;

  @IsDate()
  time: Date;
}
