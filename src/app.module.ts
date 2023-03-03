import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsonModule } from './json/json.module';
import { YmlModule } from './yml/yml.module';
import { CsvModule } from './csv/csv.module';
import { XmlModule } from './xml/xml.module';
import { PrintModule } from './print/print.module';
import { RequestLoggerMiddleware } from './request-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SwaggerModule,
    JsonModule,
    YmlModule,
    CsvModule,
    XmlModule,
    PrintModule,
  ],
  controllers: [AppController],
  providers: [AppService, RequestLoggerMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
