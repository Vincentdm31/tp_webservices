import { ApiException } from '@rendu-tp0/api/core/error';
import { MatchDto } from '@rendu-tp0/common/resource/match';
import { getModelToken } from '@nestjs/mongoose';
import { MockFactory, Test, TestingModule } from '@nestjs/testing';
import { Error, model, Model } from 'mongoose';
import { Observable } from 'rxjs';
import {
  MatchDocument,
  MatchEntity,
  MatchEntityWithId,
  MatchSchema,
} from './match.entity';
import { MatchService } from './match.service';
import * as mockingoose from 'mockingoose';
import { matchDocumentToDto } from './match.mapper';

jest.mock('./match.mapper');

describe('MatchService', () => {
  let service: MatchService;
  let modelMock: Partial<Model<MatchDocument>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchService],
    })
      .useMocker((token) => {
        if (token === getModelToken(MatchEntity.name)) {
          modelMock = model<MatchDocument>(MatchEntity.name, MatchSchema);
          const entities: MatchEntityWithId[] = [
            {
              id: '',
              date: new Date(),
              homeTeamName: 'Equipe 1',
              awayTeamName: 'Equipe 2',
              homeTeamScore: 1,
              awayTeamScore: 2,
            },
            {
              id: '',
              date: new Date(),
              homeTeamName: 'Equipe 3',
              awayTeamName: 'Equipe 4',
              homeTeamScore: 1,
              awayTeamScore: 2,
            },
          ];
          mockingoose(modelMock)
            .toReturn(entities, modelMock.find.name)
            .toReturn(10, modelMock.count.name)
            .toReturn(entities[0], modelMock.findOne.name);
          return modelMock;
        }
      })
      .compile();

    service = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an Observable', () => {
      const result = service.findAll(
        { page: 1, size: 2 },
        { homeTeamName: 'Equipe 1', awayTeamName: 'Equipe 2' }
      );

      expect(result).toBeInstanceOf(Promise);
    });

    it('should stream PaginatedItems items', (done) => {
      const result = service.findAll(
        { page: 1, size: 2 },
        { homeTeamName: 'Equipe 1', awayTeamName: 'Equipe 2' }
      );

      result.then((data) => {
        expect(data).toBeTruthy();
        expect(data).toBeInstanceOf(Array);
        done();
      });
    });

    it('should call mapper.mapEntitiesToDtos one time', (done) => {
      const mapperMock = matchDocumentToDto as unknown as jest.MockInstance<
        MatchDto,
        [MatchDocument]
      >;
      mapperMock.mockReturnValue({
        id: '',
        date: '1995-12-17T03:24:00',
        homeTeamName: 'Equipe 1',
        awayTeamName: 'Equipe 2',
        homeTeamScore: 1,
        awayTeamScore: 2,
      });

      const result = service.findAll(
        { page: 1, size: 2 },
        { homeTeamName: 'Equipe 1', awayTeamName: 'Equipe 2' }
      );

      result.then(() => {
        expect(mapperMock).toHaveBeenCalled();
        done();
      });
    });
  });
});
