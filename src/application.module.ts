import { TokenController } from './token/token.controller';
import { TokenService } from './token/token.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import applicationConfig from 'config/application.config';
import { FirestoreModule } from './firestore/firestore.module';
import { SpotifyModule } from './spotify/spotify.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig],
    }),
    SpotifyModule,
    FirestoreModule,
  ],
})
export class AppModule {}
