import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');
  await app.listen(serverConfig.port);
  Logger.log(`application running on port ${serverConfig.port}`);
}
bootstrap();
