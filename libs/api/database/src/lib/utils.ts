import { ConfigService } from '@nestjs/config';

export const mongoDbUri = function (configService: ConfigService) {
  const username = configService.get('DATABASE_USERNAME');
  const password = configService.get('DATABASE_PASSWORD');
  const host = configService.get('DATABASE_HOST');
  const databaseName = configService.get('DATABASE_NAME');
  return {
    uri: `mongodb+srv://${username}:${password}@${host}/${databaseName}`,
  };
};

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface FilterParams {
  date?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  team?: string;
}
