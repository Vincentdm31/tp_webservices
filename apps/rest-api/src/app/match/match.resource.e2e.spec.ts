import {
  MatchDocument,
  MatchEntity,
  MatchService,
} from '@rendu-tp0/api/match-service';
import { MatchModule } from './match.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Matchs', () => {
  let app: INestApplication;
  let mongoMemoryServer: MongoMemoryServer;
  let service: MatchService;
  const entityId = '62333116e607ce465a4a1464';
  const updateID = '62333116e607ce465a4a1467';

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();

    const moduleRef = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), MatchModule],
    }).compile();

    const model = moduleRef.get<Model<MatchDocument>>(
      getModelToken(MatchEntity.name)
    );
    const entities = [
      {
        _id: entityId,
        date: '2022-03-08T20:00:00.000Z',
        homeTeamName: 'TOTO0',
        awayTeamName: 'Inter Milan',
        homeTeamScore: 0,
        awayTeamScore: 1,
      },
      {
        _id: '62333116e607ce465a4a1465',
        date: '2022-03-08T20:00:00.000Z',
        homeTeamName: 'TOTO1',
        awayTeamName: 'Inter Milan',
        homeTeamScore: 0,
        awayTeamScore: 1,
      },
      {
        _id: '62333116e607ce465a4a1466',
        date: '2022-03-08T20:00:00.000Z',
        homeTeamName: 'TOTO2',
        awayTeamName: 'Inter Milan',
        homeTeamScore: 0,
        awayTeamScore: 1,
      },
      {
        _id: updateID,
        date: '2022-03-08T20:00:00.000Z',
        homeTeamName: 'TOTO3',
        awayTeamName: 'Inter Milan',
        homeTeamScore: 0,
        awayTeamScore: 1,
      },
    ];
    for (const entity of entities) {
      await model.create(entity);
    }
    service = moduleRef.get<MatchService>(MatchService);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /matchs', () => {
    it('POST should post data', (done) => {
      const createMatchRequest = {
        date: '2022-03-08T20:00:00.000Z',
        homeTeamName: 'TEST1',
        awayTeamName: 'TEST2',
        homeTeamScore: 1,
        awayTeamScore: 2,
      };
      request(app.getHttpServer())
        .post('/matchs')
        .send(createMatchRequest)
        .then((response) => {
          expect(response.status).toBe(201);
          expect(response.body).toMatchObject(createMatchRequest);
          expect(response.body.id).toBeDefined();
          expect(response.body.id).toBeTruthy();
          expect(response).toBeDefined();
          done();
        });
    });
    it('POST should fail if homeTeamName or awayTeamName or date is empty', (done) => {
      const createMatchRequest = {
        date: '2022-03-08T20:00:00.000Z',
        homeTeamName: '',
        awayTeamName: 'TEST2',
        homeTeamScore: 1,
        awayTeamScore: 2,
      };
      request(app.getHttpServer())
        .post('/matchs')
        .send(createMatchRequest)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response).toBeDefined();
          done();
        });
    });
    it('POST should fail if string homeTeamName or awayTeamName or date > 31 carac', (done) => {
      const createMatchRequest = {
        date: '2022-03-08T20:00:00.000Z',
        homeTeamName: new Array(31).fill('a').join(''),
        awayTeamName: 'TEST2',
        homeTeamScore: 1,
        awayTeamScore: 2,
      };
      request(app.getHttpServer())
        .post('/matchs')
        .send(createMatchRequest)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response).toBeDefined();
          done();
        });
    });
    it('POST should fail if homeTeamName or awayTeamName or date =! string', (done) => {
      const createMatchRequest = {
        date: '2022-03-08T20:00:00.000Z',
        homeTeamName: 4,
        awayTeamName: 'TEST2',
        homeTeamScore: 1,
        awayTeamScore: 2,
      };
      request(app.getHttpServer())
        .post('/matchs')
        .send(createMatchRequest)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response).toBeDefined();
          done();
        });
    });
    it('POST should fail if homeTeamScore or awayTeamScore =! number', (done) => {
      const createMatchRequest = {
        date: '2022-03-08T20:00:00.000Z',
        homeTeamName: 'TEST1',
        awayTeamName: 'TEST2',
        homeTeamScore: 'string',
        awayTeamScore: 2,
      };
      request(app.getHttpServer())
        .post('/matchs')
        .send(createMatchRequest)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response).toBeDefined();
          done();
        });
    });
  });

  describe('GET /matchs', () => {
    it('GET should resolve data', (done) => {
      request(app.getHttpServer())
        .get('/matchs')
        .then((response) => {
          expect(response).toBeDefined();
          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBeTruthy();
          done();
        });
    });
    it(' GET should resolve a page', (done) => {
      request(app.getHttpServer())
        .get('/matchs?page=1&size=3')
        .then((response) => {
          expect(response).toBeDefined();
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(3);
          expect(response.body[0].homeTeamName).toBe('TOTO0');
          done();
        });
    });
    // it('fetch matches', () => {
    //   request(app.getHttpServer())
    //     .get(`/matchs/refresh/fetch`)
    //     .then((response) => {
    //       expect(response).toBeDefined();
    //       expect(response.status).toBe(200);
    //       expect(response.body).toBe('done');
    //     });
    // });
  });

  describe('DELETE /matchs', () => {
    it('DELETE should remove data', (done) => {
      request(app.getHttpServer())
        .delete(`/matchs/${entityId}`)
        .then((response) => {
          expect(response.status).toBe(204);
          expect(response).toBeDefined();
          done();
        });
    });
    it('DELETE should fail 404', (done) => {
      request(app.getHttpServer())
        .delete(
          `/matchs/${
            Array.from(entityId)
              .splice(0, entityId.length - 1)
              .join('') + 'a'
          }`
        )
        .then((response) => {
          expect(response.status).toBe(404);
          expect(response).toBeDefined();
          done();
        });
    });
  });
  describe('UPDATE /matchs', () => {
    it('UPDATE should update data', (done) => {
      const updateMatchRequest = {
        date: '2022-03-08T20:00:00.000Z',
        homeTeamName: 'TEST1',
        awayTeamName: 'TEST2',
        homeTeamScore: 1,
        awayTeamScore: 2,
      };
      request(app.getHttpServer())
        .patch(`/matchs/${updateID}`)
        .send(updateMatchRequest)
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject(updateMatchRequest);
          expect(response.body.id).toBeDefined();
          expect(response.body.id).toBeTruthy();
          expect(response).toBeDefined();
          done();
        });
    });

    it('UPDATE should fail if homeTeamName or awayTeamScore or date is empty', (done) => {
      const updateMatchRequest = {
        date: '2022-03-08T20:00:00.000Z',
        homeTeamName: '',
        awayTeamName: 'TEST2',
        homeTeamScore: 1,
        awayTeamScore: 2,
      };
      request(app.getHttpServer())
        .patch(`/matchs/${entityId}`)
        .send(updateMatchRequest)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response).toBeDefined();
          done();
        });
    });

    it('UPDATE should fail if homeTeamName or awayTeamName or date > 30 carac', (done) => {
      const updateMatchRequest = {
        date: '2022-03-08T20:00:00.000Z',
        homeTeamName: new Array(31).fill('a').join(''),
        awayTeamName: 'TEST2',
        homeTeamScore: 1,
        awayTeamScore: 2,
      };
      request(app.getHttpServer())
        .patch(`/matchs/${entityId}`)
        .send(updateMatchRequest)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response).toBeDefined();
          done();
        });
    });

    it('UPDATE should fail if homeTeamName or awayTeamName or date is not a string', (done) => {
      const updateMatchRequest = {
        date: '2022-03-08T20:00:00.000Z',
        homeTeamName: 4,
        awayTeamName: 'TEST2',
        homeTeamScore: 1,
        awayTeamScore: 2,
      };
      request(app.getHttpServer())
        .patch(`/matchs/${entityId}`)
        .send(updateMatchRequest)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response).toBeDefined();
          done();
        });
    });
    it('UPDATE should fail if homeTeamScore or awayTeamScore is not a number', (done) => {
      const updateMatchRequest = {
        date: '2022-03-08T20:00:00.000Z',
        homeTeamName: 'TEST1',
        awayTeamName: 'TEST2',
        homeTeamScore: 'string',
        awayTeamScore: 2,
      };
      request(app.getHttpServer())
        .patch(`/matchs/${entityId}`)
        .send(updateMatchRequest)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response).toBeDefined();
          done();
        });
    });

    //
    it('should fetch match', (done) => {
      service
        .TESTgetLastDates()
        .then((date) => {
          console.log('date', date);
          expect(date.length).toBe(7);
          expect(date.split('-')[0]).toBe('2022');
          expect(Number(date.split('-')[0].length)).toBe(4);
          expect(Number(date.split('-')[1].length)).toBe(2);
          expect(date).toMatch(/[0-9]{4}-[0-9]{2}/);
          return date;
        })
        .then((date) =>
          service.TESTfetchMatchs(date).then((matchs) => {
            expect(matchs[0].homeTeamName).toBeTruthy();
            expect(typeof matchs[0].homeTeamName).toBe('string');
            expect(typeof matchs[0].awayTeamName).toBe('string');
            expect(typeof matchs[0].homeTeamScore).toBe('number');
            expect(typeof matchs[0].awayTeamScore).toBe('number');
            return matchs;
          })
        )
        .then((matchs) => {
          matchs.map((match) => {
            const result = service.insertGame(match);

            result.then((e) => {
              expect(e).toBeTruthy();
            });
          });
          done();
        });
    });
  });
});
