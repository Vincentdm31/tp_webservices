import { Injectable, Logger } from '@nestjs/common';
import {
  EquipeCreateDto,
  EquipeDto,
  EquipeResetDto,
  EquipeUpdateDto,
} from '@rendu-tp0/common/resource/equipe';
import {
  EquipeDocument,
  EquipeEntity,
  EquipeEntityWithId,
} from './equipe.entity';

const logMapper = new Logger('LogMapper');

export const equipeDocumentToDto = (document: EquipeDocument): EquipeDto => {
  logMapper.debug('equipeDocumentToDto is find');
  logMapper.log('equipeDocumentToDto is find');
  logMapper.warn('equipeDocumentToDto is find');
  logMapper.error('equipeDocumentToDto is find');
  return {
    id: document.id,
    teamName: document.teamName,
  };
};

export const equipeCreateDtoToEntity = (dto: EquipeCreateDto): EquipeEntity => {
  logMapper.debug('equipeCreateDtoToEntity is find');
  logMapper.log('equipeCreateDtoToEntity is find');
  logMapper.warn('equipeCreateDtoToEntity is find');
  logMapper.error('equipeCreateDtoToEntity is find');
  return {
    teamName: dto.teamName,
  };
};

export const equipeUpdateDtoToEntity = (dto: EquipeUpdateDto): EquipeEntityWithId => {
  logMapper.debug('equipeUpdateDtoToEntity is find');
  logMapper.log('equipeUpdateDtoToEntity is find');
  logMapper.warn('equipeUpdateDtoToEntity is find');
  logMapper.error('equipeUpdateDtoToEntity is find');
  return {
    id: dto.id,
    teamName: dto.teamName,
  };
};

export const equipeResetDtoToEntity = (dto: EquipeResetDto): EquipeEntityWithId => {
  logMapper.debug('equipeResetDtoToEntity is find');
  logMapper.log('equipeResetDtoToEntity is find');
  logMapper.warn('equipeResetDtoToEntity is find');
  logMapper.error('equipeResetDtoToEntity is find');
  return {
    id: dto.id,
    teamName: dto.teamName ?? null,
  };
};
