import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { CacheModule } from '@nestjs/common';
import { ApiMatchServiceModule } from '@rendu-tp0/api/match-service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60,
      max: 10,
    }),
    ApiMatchServiceModule,
  ],
  controllers: [MatchController],
})
export class MatchModule {}
