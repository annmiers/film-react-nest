import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config'
import { ConfigService } from '@nestjs/config';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';
import { DevLogger } from './logger/dev.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const logFormat = configService.get('LOG_FORMAT', 'dev');

  let logger;
  switch (logFormat) {
    case 'json':
      logger = new JsonLogger();
      break;
    case 'tskv':
      logger = new TskvLogger();
      break;
    case 'dev':
    default:
      logger = new DevLogger();
  }

  app.useLogger(logger);
  app.setGlobalPrefix("api/afisha");
  app.enableCors();

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
