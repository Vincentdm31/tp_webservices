import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipeEntity, EquipeSchema } from './equipe.entity';
import { EquipeService } from './equipe.service';
import { EquipeController } from './equipe.controller';
import { CacheModule } from '@nestjs/common';

@Module({
  imports: [
      CacheModule.register({
        ttl: 60,
        max: 10
      }),
    MongooseModule.forFeature([
      {
        name: EquipeEntity.name,
        schema: EquipeSchema,
      },
    ]),
  ],
  controllers: [EquipeController],
  providers: [EquipeService],
})
export class EquipeModule {}
