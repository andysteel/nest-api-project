import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from "config";

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(AppModule)
  const serverConfig = config.get('server')
  const configSwaggerUrl = 'api'

  if(process.env.NODE_ENV === 'development') {
    app.enableCors()
  } else {
    //example specifing the origin
    app.enableCors({origin: serverConfig.origin})
    logger.log(`Accepting request from ${serverConfig.origin}`)
  }

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Task management example')
    .setDescription('The Task management API description')
    .setVersion('1.0')
    .addTag('task')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(configSwaggerUrl, app, document);

  const port = process.env.PORT || serverConfig.port
  let url = ''
  await app.listen(port);
  await app.getUrl().then((value) => url = value)
  logger.log(`Application listening on port ${port}`)
  logger.log(`Documentation is available on ${url}/${configSwaggerUrl}`)
}
bootstrap();
