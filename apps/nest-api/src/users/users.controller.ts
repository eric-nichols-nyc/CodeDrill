import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: Nest DI needs a runtime class token for constructor injection
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private readonly usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: unknown) {
    return this.usersService.create(body);
  }
}
