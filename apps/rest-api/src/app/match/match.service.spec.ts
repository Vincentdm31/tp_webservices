import { MatchDto } from '@rendu-tp0/common/resource/match';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { model, Model } from 'mongoose';
import axios from 'axios';
import { parse } from 'node-html-parser';

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
              externalId: 3633538,
            },
            {
              id: '',
              externalId: 3633537,
              awayTeamName: 'Juventus Turin',
              awayTeamScore: 1,
              date: new Date('2021-09-20T19:00:00.000Z'),
              homeTeamName: 'Zénith',
              homeTeamScore: 3,
            },
          ];
          mockingoose(modelMock)
            .toReturn(entities, modelMock.find.name)
            .toReturn(10, modelMock.count.name)
            .toReturn(entities[0], modelMock.findOne.name)
            .toReturn(entities[0], modelMock.findOneAndUpdate.name);
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
        externalId: 452348,
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

  describe('Fetch games', () => {
    it('should insert a match', () => {
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
        externalId: 3633538,
      });

      const game = {
        externalId: 3633538,
        awayTeamName: 'Juventus Turin',
        awayTeamScore: 1,
        date: '2021-09-20T19:00:00.000Z',
        homeTeamName: 'Zénith',
        homeTeamScore: 3,
      };
      const result = service.insertGame(game);

      mockingoose(modelMock).toReturn(result, 'findOneAndUpdate');

      return modelMock
        .findOneAndUpdate(
          {
            externalId: game.externalId,
          },
          game,
          { upsert: true, new: true }
        )
        .exec()
        .then((doc) => {
          expect(doc).toBeTruthy();
          expect(typeof doc).toBe('object');
        });
    }, 20000);

    it('should return a date', async () => {
      const res = await service.TESTgetLastDates();

      expect(res.length).toBe(7);
      expect(res.split('-')[0]).toBe('2022');
      expect(Number(res.split('-')[0].length)).toBe(4);
      expect(Number(res.split('-')[1].length)).toBe(2);
      expect(res).toMatch(/[0-9]{4}-[0-9]{2}/);
    });
  });
});
