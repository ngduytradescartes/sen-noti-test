import { IsString } from 'class-validator';

export class DappDto {
  @IsString()
  address: string;

  @IsString()
  name: string;

  @IsString()
  logo: string;
}
