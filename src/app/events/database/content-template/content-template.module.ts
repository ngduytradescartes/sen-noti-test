import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ContentTemplate,
  ContentTemplateSchema,
} from 'src/schemas/content-template.schema';
import { ContentTemplateController } from './content-template.controller';
import { ContentTemplateService } from './content-template.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContentTemplate.name, schema: ContentTemplateSchema },
    ]),
  ],
  controllers: [ContentTemplateController],
  providers: [ContentTemplateService],
})
export class ContentTemplateModule {}
