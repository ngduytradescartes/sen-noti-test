import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

export const MIN_LIMIT = 1;
export const MAX_LIMIT = 500;

@Injectable()
export class ParseLimitPipe implements PipeTransform {
  transform(value: string | number = MAX_LIMIT) {
    try {
      const limit = Math.max(MIN_LIMIT, Math.min(MAX_LIMIT, Number(value)));
      return limit;
    } catch (er) {
      throw new BadRequestException('Invalid limit value');
    }
  }
}
