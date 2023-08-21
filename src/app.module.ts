import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from 'src/events/events.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AppDummy } from 'src/app.dummy';
import ormConfig from 'src/config/orm.config';
import ormConfigProd from 'src/config/orm.config.prod';
import { AppKoreaService } from 'src/events/app.korea.service';
import { SchoolModule } from 'src/school/school.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    EventsModule,
    SchoolModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useClass: AppKoreaService,
    },
    {
      provide: 'APP_NAME',
      useValue: 'Nest Events Backend!',
    },
    {
      provide: 'MESSAGE',
      inject: [AppDummy],
      useFactory: (app) => `${app.dummy()} Factory!`,
    },
    AppDummy,
  ],
})
export class AppModule {}
