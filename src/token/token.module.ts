import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IApplicationConfig } from '../../config/application.config';
import { FirestoreService } from '../firestore/firestore.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IApplicationConfig>) => ({
        baseURL: configService.get('BASE_URL'),
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${configService.get('CLIENT_ID')}:${configService.get(
              'CLIENT_SECRET',
            )}`,
          ).toString('base64')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TokenController],
  providers: [TokenService, FirestoreService],
})
export class TokenModule {}
