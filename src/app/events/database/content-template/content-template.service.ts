import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';

import { MAX_LIMIT } from 'src/pipelines/limit.pipe';
import { MIN_OFFSET } from 'src/pipelines/offset.pipe';
import { EnvironmentVariables } from 'src/config';
import { ContentTemplateDto } from './content-template.dto';
import {
  ContentTemplate,
  ContentTemplateDocument,
} from 'src/schemas/content-template.schema';

@Injectable()
export class ContentTemplateService {
  constructor(
    @InjectModel(ContentTemplate.name)
    private contentTemplateModel: Model<ContentTemplateDocument>,
    private config: ConfigService<EnvironmentVariables>,
  ) {}

  dbProjection = this.config.get('mongodb.projection', { infer: true });

  async getContentTemplates({
    filter = {},
    search = '',
    offset = MIN_OFFSET,
    limit = MAX_LIMIT,
  }: {
    filter?: object;
    search?: string;
    offset?: number;
    limit?: number;
  }) {
    const cond = search ? { ...filter, $text: { $search: search } } : filter;
    const contentTemplates = await this.contentTemplateModel
      .find(cond, this.dbProjection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    return contentTemplates;
  }

  async getContentTemplate(query: {
    eventName: string;
    dappId: Types.ObjectId;
  }) {
    return await this.contentTemplateModel.findOne(query).exec();
  }

  async newContentTemplate(contentTemplate: ContentTemplateDto) {
    const newContentTemplate = await new this.contentTemplateModel({
      ...contentTemplate,
    }).save();
    return newContentTemplate;
  }
}
