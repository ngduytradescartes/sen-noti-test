import { IsString } from 'class-validator';

export class DappDto {
  @IsString()
  name: string;

  @IsString()
  logo: string;
}
