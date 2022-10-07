import { IsString, IsObject, IsBoolean, IsDate } from 'class-validator';
import { Dapp } from 'src/schemas/dapp.schema';
import { User } from 'src/schemas/user.schema';

export class SubscriptionDto {
  @IsObject()
  dappId: Dapp;

  @IsObject()
  userId: User;

  @IsString()
  content: string;

  @IsBoolean()
  seen: boolean;

  @IsDate()
  time: Date;
}
