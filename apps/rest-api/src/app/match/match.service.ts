import { handleDocumentNotFound } from '@rendu-tp0/api/repository/error';
import {
  MatchCreateDto,
  MatchDto,
  MatchResetDto,
  MatchUpdateDto,
} from '@rendu-tp0/common/resource/match';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatchDocument, MatchEntity } from './match.entity';
import {
  matchCreateDtoToEntity,
  matchDocumentToDto,
  matchResetDtoToEntity,
  matchUpdateDtoToEntity,
} from './match.mapper';
import { FilterParams, PaginationParams } from './match.controller';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(MatchEntity.name) private model: Model<MatchDocument>
  ) {}

  create(dto: MatchCreateDto): Promise<MatchDto> {
    const entity = matchCreateDtoToEntity(dto);
    return this.model.create(entity).then(matchDocumentToDto);
  }

  findAll(
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ): Promise<MatchDto[]> {
    return this.model
      .find({
        ...(filterParams.homeTeamName
          ? { homeTeamName: filterParams.homeTeamName }
          : {}),
        ...(filterParams.awayTeamName
          ? { awayTeamName: filterParams.awayTeamName }
          : {}),
        ...(filterParams.team
          ? {
              $or: [
                { awayTeamName: filterParams.team },
                { homeTeamName: filterParams.team },
              ],
            }
          : {}),
        ...(filterParams.date
          ? {
              date: {
                $gte: new Date(filterParams.date),
                $lt: new Date(filterParams.date).setDate(
                  new Date(filterParams.date).getDate() + 1
                ),
              },
            }
          : {}),
      })
      .skip((paginationParams.page - 1) * paginationParams.size)
      .limit(paginationParams.size)
      .exec()
      .then((entities) => entities.map(matchDocumentToDto));
  }

  findOne(id: string): Promise<MatchDto> {
    return this.model
      .findById(id)
      .orFail()
      .exec()
      .then(matchDocumentToDto)
      .catch(handleDocumentNotFound);
  }

  update(dto: MatchUpdateDto): Promise<MatchDto> {
    const entity = matchUpdateDtoToEntity(dto);
    return this.model
      .findByIdAndUpdate(entity.id, entity, { new: true })
      .orFail()
      .exec()
      .then(matchDocumentToDto)
      .catch(handleDocumentNotFound);
  }

  reset(dto: MatchResetDto): Promise<MatchDto> {
    const entity = matchResetDtoToEntity(dto);
    return this.model
      .findByIdAndUpdate(entity.id, entity, { new: true })
      .orFail()
      .exec()
      .then(matchDocumentToDto)
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
