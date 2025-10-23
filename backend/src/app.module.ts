import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Film as MongooseFilm, FilmSchema } from './films/schemas/film.schema';
import { Order, OrderSchema } from './order/schemas/order.schema';
import { Film as TypeOrmFilm } from './films/entities/film.entity';
import { Schedule } from './films/entities/schedule.entity';
import { FilmsController } from './films/films.controller';
import { OrdersController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrdersService } from './order/order.service';
import { MongooseFilmsRepository } from './repository/mongoose-films.repository';
import { TypeOrmFilmsRepository } from './repository/typeorm-films.repository';
import { configProvider } from './app.config.provider';
import { FilmsRepository } from './repository/films.repository.interface';

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
      { name: MongooseFilm.name, schema: FilmSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST', 'localhost'),
        port: configService.get('POSTGRES_PORT', 5432),
        username: configService.get('POSTGRES_USERNAME', 'afisha_user'),
        password: configService.get('POSTGRES_PASSWORD', 'afisha_pass'),
        database: configService.get('POSTGRES_DATABASE', 'afisha'),
        entities: [TypeOrmFilm, Schedule],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([TypeOrmFilm, Schedule]),
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
    MongooseFilmsRepository,
    TypeOrmFilmsRepository,
    {
      provide: FilmsRepository,
      useFactory: (
        configService: ConfigService,
        mongooseRepo: MongooseFilmsRepository,
        typeormRepo: TypeOrmFilmsRepository,
      ) => {
        const driver = configService.get('DATABASE_DRIVER', 'mongodb');
        return driver === 'postgres' ? typeormRepo : mongooseRepo;
      },
      inject: [ConfigService, MongooseFilmsRepository, TypeOrmFilmsRepository],
    },
  ],
})
export class AppModule {}
