import { Controller, Get, Query, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ParseLimitPipe } from 'src/pipelines/limit.pipe';
import { ParseOffsetPipe } from 'src/pipelines/offset.pipe';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly service: UserService) {}
  @Get()
  async getUser(
    @Query('offset', ParseOffsetPipe) offset: number,
    @Query('limit', ParseLimitPipe) limit: number,
    @Query('search') search = '',
  ) {
    return this.service.getUsers({ search, offset, limit });
  }
  @Post()
  async createUser(@Req() request: Request) {
    return this.service.newUser(request.body);
  }
}
