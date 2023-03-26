import { PickType } from '@nestjs/swagger';
import { User } from 'src/users/users.schema';

export class Ranking extends PickType(User, ['name', 'money'] as const) {}
