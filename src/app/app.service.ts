import { Injectable, Inject } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;
  public createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.config.get('mongodb.uri', { infer: true }),
    };
  }
}
