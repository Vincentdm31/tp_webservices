import { MatchService } from './match.service';
import { MatchEntity, MatchSchema } from './match.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MatchEntity.name,
        schema: MatchSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [MatchService],
  exports: [MatchService],
})
export class ApiMatchServiceModule {}
