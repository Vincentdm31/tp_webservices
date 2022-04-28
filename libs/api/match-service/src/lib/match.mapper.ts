import {
  MatchCreateDto,
  MatchDto,
  MatchResetDto,
  MatchUpdateDto,
} from '@rendu-tp0/common/resource/match';
import { MatchDocument, MatchEntity, MatchEntityWithId } from './match.entity';
import { Logger } from '@nestjs/common';

const logMapper = new Logger('LogMapper');

export const matchDocumentToDto = (document: MatchDocument): MatchDto => {
  logMapper.debug('matchDocumentToDto is find');
  logMapper.log('matchDocumentToDto is find');
  logMapper.warn('matchDocumentToDto is find');
  logMapper.error('matchDocumentToDto is find');
  return {
    id: document.id,
    date: document.date?.toISOString(),
    homeTeamName: document.homeTeamName,
    awayTeamName: document.awayTeamName,
    homeTeamScore: document.homeTeamScore,
    awayTeamScore: document.awayTeamScore,
    externalId: document.externalId,
  };
};

export const matchCreateDtoToEntity = (dto: MatchCreateDto): MatchEntity => {
  logMapper.debug('matchCreateDtoToEntity is find');
  logMapper.log('matchCreateDtoToEntity is find');
  logMapper.warn('matchCreateDtoToEntity is find');
  logMapper.error('matchCreateDtoToEntity is find');
  return {
    date: dto.date && new Date(dto.date),
    homeTeamName: dto.homeTeamName,
    awayTeamName: dto.awayTeamName,
    homeTeamScore: dto.homeTeamScore,
    awayTeamScore: dto.awayTeamScore,
    externalId: dto.externalId,
  };
};

export const matchUpdateDtoToEntity = (
  dto: MatchUpdateDto
): MatchEntityWithId => {
  logMapper.debug('matchUpdateDtoToEntity is find');
  logMapper.log('matchUpdateDtoToEntity is find');
  logMapper.warn('matchUpdateDtoToEntity is find');
  logMapper.error('matchUpdateDtoToEntity is find');
  return {
    id: dto.id,
    date: dto.date && new Date(dto.date),
    homeTeamName: dto.homeTeamName,
    awayTeamName: dto.awayTeamName,
    homeTeamScore: dto.homeTeamScore,
    awayTeamScore: dto.awayTeamScore,
    externalId: dto.externalId,
  };
};

export const matchResetDtoToEntity = (
  dto: MatchResetDto
): MatchEntityWithId => {
  logMapper.debug('matchResetDtoToEntity is find');
  logMapper.log('matchResetDtoToEntity is find');
  logMapper.warn('matchResetDtoToEntity is find');
  logMapper.error('matchResetDtoToEntity is find');
  return {
    id: dto.id,
    date: dto.date ? new Date(dto.date) : null,
    homeTeamName: dto.homeTeamName ?? null,
    awayTeamName: dto.awayTeamName ?? null,
    homeTeamScore: dto.homeTeamScore ?? null,
    awayTeamScore: dto.awayTeamScore ?? null,
    externalId: dto.externalId ?? null,
  };
};
