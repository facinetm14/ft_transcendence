import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    // origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST',
    credentials: true,
  });

  const imgServer = express();
  imgServer.use('/avatars', express.static(join(__dirname, '..', 'avatars')));

  app.use('static', imgServer);
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(5000);
}
bootstrap();
