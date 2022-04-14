import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchEntity, MatchSchema } from './match.entity';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { CacheModule } from '@nestjs/common';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60,
      max: 10
    }),
    MongooseModule.forFeature([
      {
        name: MatchEntity.name,
        schema: MatchSchema,
      },
    ]),
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
