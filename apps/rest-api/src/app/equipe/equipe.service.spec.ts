import { ApiException } from '@rendu-tp0/api/core/error';
import { EquipeDto } from '@rendu-tp0/common/resource/equipe';
import { getModelToken } from '@nestjs/mongoose';
import { MockFactory, Test, TestingModule } from '@nestjs/testing';
import { Error, model, Model } from 'mongoose';
import { Observable } from 'rxjs';
import {
  EquipeDocument,
  EquipeEntity,
  EquipeEntityWithId,
  EquipeSchema,
} from './equipe.entity';
import { EquipeService } from './equipe.service';
import * as mockingoose from 'mockingoose';
import { equipeDocumentToDto } from './equipe.mapper';

jest.mock('./equipe.mapper');

describe('EquipeService', () => {
  let service: EquipeService;
  let modelMock: Partial<Model<EquipeDocument>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipeService],
    })
      .useMocker((token) => {
        if (token === getModelToken(EquipeEntity.name)) {
          modelMock = model<EquipeDocument>(EquipeEntity.name, EquipeSchema);
          const entities: EquipeEntityWithId[] = [
            {
              id: '',
              teamName: '',
            },
            {
              id: '',
              teamName: '',
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

    service = module.get<EquipeService>(EquipeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an Observable', () => {
      const result = service.findAll({ page: 1, size: 2 });

      expect(result).toBeInstanceOf(Promise);
    });

    it('should stream PaginatedItems items', (done) => {
      const result = service.findAll({ page: 1, size: 2 });

      result.then((data) => {
        expect(data).toBeTruthy();
        expect(data).toBeInstanceOf(Array);
        done();
      });
    });

    it('should call mapper.mapEntitiesToDtos one time', (done) => {
      const mapperMock = equipeDocumentToDto as unknown as jest.MockInstance<
        EquipeDto,
        [EquipeDocument]
      >;
      mapperMock.mockReturnValue({
        id: '',
        teamName: 'team',
      });

      const result = service.findAll({ page: 1, size: 2 });

      result.then(() => {
        expect(mapperMock).toHaveBeenCalled();
        done();
      });
    });
  });
});
