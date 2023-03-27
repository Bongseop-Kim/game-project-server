import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRequestDto } from './dto/user.request.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(body: UserRequestDto) {
    const { email, name, password } = body;
    const isUserExist = await this.usersRepository.existByEmail(email);

    if (isUserExist) {
      throw new UnauthorizedException('해당하는 이메일은 이미 존재합니다.');
      // throw new HttpException('해당하는 고양이는 이미 존재합니다.', 403);
    }

    const hashedPassedword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.create({
      email,
      name,
      password: hashedPassedword,
    });
    // 전달해 주고 싶은 데이터만 전달하기 위해 virtual을 이용한 가상의 readOnlyData를 보내준다.
    return user.readOnlyData;
  }
}
