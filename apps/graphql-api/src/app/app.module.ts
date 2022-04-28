import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { environment } from '../environments/environment';
import { MatchModule } from '../match/match.module';
import { ApiDatabaseModule } from '@rendu-tp0/api/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environment.filePath,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'dist/graphql-api/src/schema.gql'),
    }),
    ApiDatabaseModule,
    MatchModule,
  ],
})
export class AppModule {}
