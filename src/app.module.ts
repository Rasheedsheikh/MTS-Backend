import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PartnerDetailsModule } from './partner-details/partner-details.module';
import { MerchantDetailsModule } from './merchant-details/merchant-details.module';
import { DigitalMarketingModule } from './digital-marketing/digital-marketing.module';
import { AdvertisementsModule } from './advertisements/advertisements.module';
import { AdvertisementRegistrationModule } from './advertisement-registration/advertisement-registration.module';
import * as crypto from 'crypto';
(global as any).crypto = crypto;


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // ⚠️ Disable in production
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    PartnerDetailsModule,
    MerchantDetailsModule,
    DigitalMarketingModule,
    AdvertisementsModule,
    AdvertisementRegistrationModule,
  ],
})
export class AppModule {}
