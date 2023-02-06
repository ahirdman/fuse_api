import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/application.module';
import * as cookieParser from 'cookie-parser';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  it('/getToken', () => {
    return request(app.getHttpServer())
      .get('/token')
      .expect(200)
      .expect({ status: 'NOT IMPLEMENTED' });
  });

  it('/createSpotifyAuthLink', () => {
    const id = '1234';
    return request(app.getHttpServer())
      .get(`/token/authorize?id=${id}`)
      .then((res) => {
        const [authState, context] = res.headers['set-cookie'];

        expect(authState).toContain('spotify_auth_state');
        expect(context).toContain(id);
        expect(res.status).toBe(200);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
