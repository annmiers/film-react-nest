// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FilmsController } from './films/films.controller';
import { OrdersController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrdersService } from './order/order.service';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule.register(new (require('@nestjs/config').ConfigService)()),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      renderPath: '/content/afisha/',
    }),
  ],
  controllers: [FilmsController, OrdersController],
  providers: [FilmsService, OrdersService],
})
export class AppModule {}
