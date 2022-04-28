import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipeEntity, EquipeSchema } from './equipe.entity';
import { EquipeService } from './equipe.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EquipeEntity.name,
        schema: EquipeSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [EquipeService],
  exports: [EquipeService],
})
export class ApiTeamServiceModule {}
