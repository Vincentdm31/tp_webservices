import { Module, ValidationPipe } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { winstonConfig } from './common/logging.config';
import { EquipeModule } from './equipe/equipe.module';
import { MatchModule } from './match/match.module';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import { environment } from '../environments/environment';
import { ClientCacheInterceptor } from './client-cache.interceptor';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiDatabaseModule } from '@rendu-tp0/api/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environment.filePath,
    }),
    ScheduleModule.forRoot(),
    ApiDatabaseModule,
    WinstonModule.forRoot(winstonConfig),
    EquipeModule,
    MatchModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClientCacheInterceptor,
    },
  ],
})
export class AppModule {}
