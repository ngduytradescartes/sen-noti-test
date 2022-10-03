import { IsString, IsObject, IsBoolean, IsDate } from 'class-validator';
import { Dapp } from 'src/schemas/dapp.schema';

export class NotificationDto {
  @IsObject()
  dappId: Dapp;

  @IsString()
  name: string;

  @IsString()
  content: string;

  @IsBoolean()
  seen: boolean;

  @IsDate()
  time: Date;
}
