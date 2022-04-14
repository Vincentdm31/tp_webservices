import { EquipeModule } from './equipe.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { EquipeDocument, EquipeEntity } from './equipe.entity';

describe('Equipes', () => {
  let app: INestApplication;
  let mongoMemoryServer: MongoMemoryServer;
  let entityId;

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();

    const moduleRef = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), EquipeModule],
    }).compile();

    const model = moduleRef.get<Model<EquipeDocument>>(
      getModelToken(EquipeEntity.name)
    );
    const entities = [
      { teamName: 'Equipe 1' },
      { teamName: 'Equipe 2' },
      { teamName: 'Equipe 3' },
      { teamName: 'Equipe 4' },
    ];
    for (const entity of entities) {
      const document = await model.create(entity);
      entityId = document.id;
    }

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /equipes', () => {
    it('POST should post data', (done) => {
      const createTeamRequest: EquipeEntity = {
        teamName: 'toto',
      };
      request(app.getHttpServer())
        .post('/equipes')
        .send(createTeamRequest)
        .then((response) => {
          expect(response.status).toBe(201);
          expect(response.body).toMatchObject(createTeamRequest);
          expect(response.body.id).toBeDefined();
          expect(response.body.id).toBeTruthy();
          expect(response).toBeDefined();
          done();
        })
    });
    it('POST should fail if teamName is empty', (done) => {
      const createTeamRequest: EquipeEntity = {
        teamName: '',
      };
      request(app.getHttpServer())
        .post('/equipes')
        .send(createTeamRequest)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response).toBeDefined();
          done();
        })
    });
    it('POST should fail if string > 31 carac', (done) => {
      const createTeamRequest: EquipeEntity = {
        teamName: new Array(31).fill('a').join(''),
      };
      request(app.getHttpServer())
        .post('/equipes')
        .send(createTeamRequest)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response).toBeDefined();
          done();
        })
    });
    it('POST should fail if teamName =! string', (done) => {
      const createTeamRequest = {
        teamName: 4
      };
      request(app.getHttpServer())
        .post('/equipes')
        .send(createTeamRequest)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response).toBeDefined();
          done();
        })
    });
  });

  describe('GET /equipes', () => {
    it('GET should resolve data', (done) => {
      request(app.getHttpServer())
        .get('/equipes')
        .then((response) => {
          expect(response).toBeDefined();
          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBeTruthy();
          done();
        })
    });
    it(' GET should resolve a page', (done) => {
      request(app.getHttpServer())
        .get('/equipes?page=1&size=3')
        .then((response) => {
          expect(response).toBeDefined();
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(3);
          expect(response.body[0].teamName).toBe('Equipe 1');
          done();
        })
    });
    it('GET should resolve 1 data', (done) => {
      request(app.getHttpServer())
        .get(`/equipes/${entityId}`)
        .then((response) => {
          expect(response).toBeDefined();
          expect(response.status).toBe(200);
          //expect(response.body.length).toBe(1);
          expect(response.body.teamName).toBe('Equipe 4');
          done();
        })
    });
  });

  describe('DELETE /equipes', () => {
    it('DELETE should remove data', (done) => {
      request(app.getHttpServer())
        .delete(`/equipes/${entityId}`)
        .then((response) => {
          expect(response.status).toBe(204);
          expect(response).toBeDefined();
          done();
        })
    });
  it('DELETE should fail 404', (done) => {
    request(app.getHttpServer())
      .delete(`/teams/${Array.from(entityId).splice(0, entityId.length - 1).join('') + 'a'}`)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response).toBeDefined();
        done();
      })
  });
  });
  describe('UPDATE /equipes', () => {
    it('UPDATE should update data', (done) => {
      const updateTeamRequest: EquipeEntity = {
        teamName: 'toto',
      };
      request(app.getHttpServer())
        .patch(`/equipes/${entityId}`)
        .send(updateTeamRequest)
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject(updateTeamRequest);
          expect(response.body.id).toBeDefined();
          expect(response.body.id).toBeTruthy();
          expect(response).toBeDefined();
          done();
        })
    });

    it('UPDATE should fail if teamName is empty', (done) => {
      const updateTeamRequest: EquipeEntity = {
        teamName: '',
      };
      request(app.getHttpServer())
        .patch(`/equipes/${entityId}`)
        .send(updateTeamRequest)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response).toBeDefined();
          done();
        })
    });

    it('UPDATE should fail if teamName > 30 carac', (done) => {
      const updateTeamRequest: EquipeEntity = {
        teamName: new Array(31).fill('a').join(''),
      };
      request(app.getHttpServer())
        .patch(`/equipes/${entityId}`)
        .send(updateTeamRequest)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response).toBeDefined();
          done();
        })
    });

    it('UPDATE should fail if teamName is not a string', (done) => {
      const updateTeamRequest = {
        teamName: 4,
      };
      request(app.getHttpServer())
        .patch(`/equipes/${entityId}`)
        .send(updateTeamRequest)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response).toBeDefined();
          done();
        })
    });
  });
});
