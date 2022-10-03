import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

export const MIN_OFFSET = 0;

@Injectable()
export class ParseOffsetPipe implements PipeTransform {
  transform(value: string | number = MIN_OFFSET) {
    try {
      const offset = Math.max(MIN_OFFSET, Number(value));
      return offset;
    } catch (er) {
      throw new BadRequestException('Invalid offset value');
    }
  }
}
