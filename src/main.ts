import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common/pipes';
import * as compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import CONFIG from './commons/config/config';
import { HttpExceptionFilter } from './commons/filters/httpException.filter';
import { CustomResponseInterceptor } from './commons/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = CONFIG().config;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      validationError: { value: true, target: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new CustomResponseInterceptor());
  app.use(compression());
  app.use(helmet());

  app.enableCors();

  await app.listen(config.port, () => {
    console.log('Framer started on port ' + config.port);
  });
}
bootstrap();
