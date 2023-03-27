import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { RankingGateway } from './ranking.gateway';
@Module({
  imports: [UsersModule],
  providers: [RankingGateway],
})
export class RankingModule {}
