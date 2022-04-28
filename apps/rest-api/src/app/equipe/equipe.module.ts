import { Module } from '@nestjs/common';
import { EquipeController } from './equipe.controller';
import { CacheModule } from '@nestjs/common';
import { ApiTeamServiceModule } from '@rendu-tp0/api/team-service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60,
      max: 10,
    }),
    ApiTeamServiceModule,
  ],
  controllers: [EquipeController],
})
export class EquipeModule {}
