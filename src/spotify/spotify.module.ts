import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IApplicationConfig } from 'config/application.config';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IApplicationConfig>) => ({
        baseURL: configService.get('BASE_URL'),
      }),
      inject: [ConfigService],
    }),
    TokenModule,
  ],
  providers: [],
})
export class SpotifyModule {}
