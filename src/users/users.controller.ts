import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptor/success.interceptor';
import { ReadOnlyUserDto } from './dto/user.dto';
import { UserRequestDto } from './dto/user.request.dto';
import { UsersService } from './users.service';

@Controller('api/users')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 user 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() user) {
    //@Currentuser처럼 custom 데코레이터를 사용하는 이유
    //@Req는 사용하면 결합도가 높아지기 때문에 최대한 사용을 지양하고 사용해야할 시 custom decorator를 사용하는 것이 좋다.
    //바꾸기도 어렵고 테스트 하기도 어렵다
    //타입추론 가능하게 해준다.
    //안쓰면 @Req req -> req.user이런식으로 쓰겠지
    return user.readOnlyData;
  }

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
  @Post('signup')
  async sighUp(@Body() body: UserRequestDto) {
    return await this.usersService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }
}
