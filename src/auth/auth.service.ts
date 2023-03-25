import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogIn(data: LoginRequestDto) {
    const { email, password } = data;

    // 해당 하는 이메일이 있는지 확인
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    // password 일치 여부 확인
    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다..');
    }

    const payload = { email: email, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
