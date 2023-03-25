import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../users.schema';

export class ReadOnlyUserDto extends PickType(User, [
  'email',
  'name',
] as const) {
  //dto에서 interface를 사용하지 않고 class를 사용하는 이유는 자바스크립트 단에서도 타입 검증이 가능하다.
  //interface는 typescript 문법으로 js로 변경되면 사라지기 때문이다.
  @ApiProperty({
    example: '1092012890',
    description: 'id',
  })
  id: string;
}
