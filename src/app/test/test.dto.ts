import { IsString, IsNumberString } from 'class-validator';

export class TestDto {
  @IsString()
  name: string;

  @IsNumberString()
  age: number;

  @IsString()
  breed: string;
}
