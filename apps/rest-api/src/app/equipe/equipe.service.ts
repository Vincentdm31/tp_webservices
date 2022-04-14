import { handleDocumentNotFound } from '@rendu-tp0/api/repository/error';
import {
  EquipeCreateDto,
  EquipeDto,
  EquipeResetDto,
  EquipeUpdateDto,
} from '@rendu-tp0/common/resource/equipe';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EquipeDocument, EquipeEntity } from './equipe.entity';
import {
  equipeCreateDtoToEntity,
  equipeDocumentToDto,
  equipeResetDtoToEntity,
  equipeUpdateDtoToEntity,
} from './equipe.mapper';
import { PaginationParams } from './equipe.controller';

@Injectable()
export class EquipeService {
  constructor(
    @InjectModel(EquipeEntity.name) private model: Model<EquipeDocument>
  ) {}

  create(dto: EquipeCreateDto): Promise<EquipeDto> {
    const entity = equipeCreateDtoToEntity(dto);
    return this.model.create(entity).then(equipeDocumentToDto);
  }

  findAll(paginationParams: PaginationParams): Promise<EquipeDto[]> {
    return this.model
      .find()
      .skip((paginationParams.page - 1) * paginationParams.size)
      .limit(paginationParams.size)
      .exec()
      .then((entities) => entities.map(equipeDocumentToDto));
  }

  findOne(id: string): Promise<EquipeDto> {
    return this.model
      .findById(id)
      .orFail()
      .exec()
      .then(equipeDocumentToDto)
      .catch(handleDocumentNotFound);
  }

  update(dto: EquipeUpdateDto): Promise<EquipeDto> {
    const entity = equipeUpdateDtoToEntity(dto);
    return this.model
      .findByIdAndUpdate(entity.id, entity, { new: true })
      .orFail()
      .exec()
      .then(equipeDocumentToDto)
      .catch(handleDocumentNotFound);
  }

  reset(dto: EquipeResetDto): Promise<EquipeDto> {
    const entity = equipeResetDtoToEntity(dto);
    return this.model
      .findByIdAndUpdate(entity.id, entity, { new: true })
      .orFail()
      .exec()
      .then(equipeDocumentToDto)
      .catch(handleDocumentNotFound);
  }

  remove(id: string): Promise<void> {
    return this.model
      .deleteOne({ _id: id })
      .orFail()
      .exec()
      .then(() => null)
      .catch(handleDocumentNotFound);
  }
}
