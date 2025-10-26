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
import { FreeBookingsModule } from './free-bookings/free-bookings.module';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { MerchantRegistrationModule } from './merchant-registration/merchant-registration.module';
// import * as crypto from 'crypto';


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

    // Mailer module
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: '"MTS Support" <mtsindialtd999@gmail.com>',
        },
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
    FreeBookingsModule,
    MerchantRegistrationModule,
  ],
})
export class AppModule { }
