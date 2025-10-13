import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Film, FilmSchema } from './films/schemas/film.schema';
import { Order, OrderSchema } from './order/schemas/order.schema';
import { FilmsController } from './films/films.controller';
import { OrdersController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrdersService } from './order/order.service';
import { FilmsRepository } from './repository/films.repository';
import { configProvider } from './app.config.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Film.name, schema: FilmSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha/',
    }),
  ],
  controllers: [FilmsController, OrdersController],
  providers: [
    configProvider,
    FilmsService,
    OrdersService,
    FilmsRepository,
  ],
})
export class AppModule {}
