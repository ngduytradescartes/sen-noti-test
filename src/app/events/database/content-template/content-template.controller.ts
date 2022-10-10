import { Controller, Get, Query, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { ParseLimitPipe } from 'src/pipelines/limit.pipe';
import { ParseOffsetPipe } from 'src/pipelines/offset.pipe';
import { ContentTemplateService } from './content-template.service';

@Controller('/content-template')
export class ContentTemplateController {
  constructor(private readonly service: ContentTemplateService) {}
  @Get('/all')
  async getContentTemplates(
    @Query('offset', ParseOffsetPipe) offset: number,
    @Query('limit', ParseLimitPipe) limit: number,
    @Query('search') search = '',
  ) {
    return this.service.getContentTemplates({ search, offset, limit });
  }

  // @Get(':id')
  // async getContentTemplate(@Param() params: { id: Types.ObjectId }) {
  //   return this.service.getContentTemplate({ eventName: params.eventName });
  // }

  @Post()
  async createContentTemplate(@Req() request: Request) {
    return this.service.newContentTemplate(request.body);
  }
}
