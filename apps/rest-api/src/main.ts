/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { apiPathPrefix } from '@rendu-tp0/common/resource/core';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as expressWinston from 'express-winston';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  app.use(helmet());
  const globalPrefix = apiPathPrefix;
  app.setGlobalPrefix(globalPrefix);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  app.use(
    expressWinston.logger({
      winstonInstance: logger,
      msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}',
    })
  );
  const config = new DocumentBuilder()
    .setTitle('RenduTp')
    .setDescription('RenduTp Desc')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix, app, document);

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
