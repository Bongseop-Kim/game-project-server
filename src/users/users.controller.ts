import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptor/success.interceptor';
import { ReadOnlyUserDto } from './dto/user.dto';
import { UserRequestDto } from './dto/user.request.dto';
import { UsersService } from './users.service';

@Controller('api/users')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 500,
    description: 'Sever Error...',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ReadOnlyUserDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async sighUp(@Body() body: UserRequestDto) {
    return await this.usersService.signUp(body);
  }
}
