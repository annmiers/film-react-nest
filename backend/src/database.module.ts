import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { Film as MongooseFilm, FilmSchema } from './films/schemas/film.schema';
import { Order, OrderSchema } from './order/schemas/order.schema';
import { Film as TypeOrmFilm } from './films/entities/film.entity';
import { Schedule } from './films/entities/schedule.entity';

import { FilmsRepository } from './repository/films.repository.interface';
import { MongooseFilmsRepository } from './repository/mongoose-films.repository';
import { TypeOrmFilmsRepository } from './repository/typeorm-films.repository';

@Module({})
export class DatabaseModule {
    static register(configService: ConfigService): DynamicModule {
        const dbms = configService.get<string>('DATABASE_DRIVER', 'postgres');
        const imports = [];
        const providers: Provider[] = [];

        if (dbms === 'mongodb') {
        const uri = configService.get<string>('DATABASE_URL');
        if (!uri) throw new Error('DATABASE_URL is required for MongoDB');
        imports.push(
            MongooseModule.forRoot(uri),
            MongooseModule.forFeature([
            { name: MongooseFilm.name, schema: FilmSchema },
            { name: Order.name, schema: OrderSchema },
            ]),
        );
        providers.push({
            provide: FilmsRepository,
            useClass: MongooseFilmsRepository,
        });
        } else {
        imports.push(
            TypeOrmModule.forRoot({
            type: 'postgres',
            host: configService.get('POSTGRES_HOST', 'localhost'),
            port: +configService.get('POSTGRES_PORT', 5432),
            username: configService.get('POSTGRES_USERNAME', 'afisha_user'),
            password: configService.get('POSTGRES_PASSWORD', 'afisha_pass'),
            database: configService.get('POSTGRES_DATABASE', 'afisha'),
            entities: [TypeOrmFilm, Schedule],
            synchronize: false,
            }),
            TypeOrmModule.forFeature([TypeOrmFilm, Schedule]),
        );
        providers.push({
            provide: FilmsRepository,
            useClass: TypeOrmFilmsRepository,
        });
        }

        return {
        module: DatabaseModule,
        imports,
        providers,
        exports: [FilmsRepository],
        };
    }
}