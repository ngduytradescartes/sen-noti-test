import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestSchema, Test } from 'src/schemas/test.schema';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
