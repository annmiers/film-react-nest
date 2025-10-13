import { ConfigModule, ConfigService } from '@nestjs/config';

export const configProvider = {
    imports: [ConfigModule.forRoot()],
    provide: 'CONFIG',
    useFactory: (configService: ConfigService): AppConfig => ({
        database: {
        driver: configService.get<string>('DATABASE_DRIVER', 'mongodb'),
        url: configService.get<string>(
            'DATABASE_URL',
            'mongodb://localhost:27017/afisha',
        ),
        },
        debug: configService.get<boolean>('DEBUG', false),
    }),
    inject: [ConfigService],
    };

    export interface AppConfig {
    database: AppConfigDatabase;
    debug: boolean;
}

export interface AppConfigDatabase {
    driver: string;
    url: string;
}
