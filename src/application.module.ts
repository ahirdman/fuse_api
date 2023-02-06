import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import applicationConfig from '../config/application.config';
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
