import { Module } from '@nestjs/common';
import { ApiMatchServiceModule } from '@rendu-tp0/api/match-service';
import { MatchResolver } from './match.resolver';

@Module({
  imports: [ApiMatchServiceModule],
  providers: [MatchResolver],
})
export class MatchModule {}
