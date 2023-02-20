import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AuthorizedTokenResponse } from 'src/token/token.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly spotifyConfiguration: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  public async getInitalToken(body: string): Promise<AuthorizedTokenResponse> {
    const url = `${this.spotifyConfiguration.get(
      'SPOTIFY_BASE_URL',
    )}/api/token`;

    const { data } = await firstValueFrom(
      this.httpService.post(url, body).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data);
          throw 'An error occured';
        }),
      ),
    );

    return data;
  }

  public async getRefreshedToken() {
    return 'NOT IMPLEMENTED';
  }
}
