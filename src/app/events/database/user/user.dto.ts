import { IsString, IsObject } from 'class-validator';
import { Dapp } from 'src/schemas/dapp.schema';

export class UserDto {
  @IsObject()
  dappId: Dapp;

  @IsString()
  address: string;
}
