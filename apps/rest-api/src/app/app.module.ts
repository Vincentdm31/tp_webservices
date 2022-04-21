import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { winstonConfig } from './common/logging.config';
import { EquipeModule } from './equipe/equipe.module';
import { MatchModule } from './match/match.module';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { environment } from '../environments/environment';
import { ClientCacheInterceptor } from './client-cache.interceptor';
import { ScheduleModule } from '@nestjs/schedule';

export const mongoDbUri = function (configService: ConfigService) {
  const username = configService.get('DATABASE_USERNAME');
  const password = configService.get('DATABASE_PASSWORD');
  const host = configService.get('DATABASE_HOST');
  const databaseName = configService.get('DATABASE_NAME');
  return {
    uri: `mongodb+srv://${username}:${password}@${host}/${databaseName}`,
  };
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environment.filePath,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongoDbUri,
      inject: [ConfigService],
    }),
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
