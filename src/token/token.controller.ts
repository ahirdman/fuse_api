import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { TokenService } from './token.service';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { CallbackQueryDto, UserBodyDto } from './token.dto';
import { FirestoreService } from '../firestore/firestore.service';
import { Response, Request } from 'express';
import { IApplicationConfig } from 'config/application.config';

@Controller('/token')
export class TokenController {
  private static stateKey = 'spotify_auth_state';
  private static contextKey = 'sessionContext';
  private static signUpStatusPath = '/signup/spotify?status=';

  constructor(
    private readonly configService: ConfigService<IApplicationConfig>,
    private readonly tokenService: TokenService,
    private readonly firestoreService: FirestoreService,
  ) {}

  @Get('/')
  public getToken() {
    return { status: 'NOT IMPLEMENTED' };
  }

  @Get('/authorize')
  public async createSpotifyAuthLink(
    @Query() query: UserBodyDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const state = uuidv4();

    const queryParams = this.transofrmSearchParams({
      response_type: 'code',
      client_id: this.configService.get('SPOTIFY_CLIENT_ID'),
      scope: this.configService.get('SPOTIFY_AUTH_SCOPE'),
      redirect_uri: this.configService.get('SPOTIFY_REDIRECT_URI'),
      state,
    });

    response
      .cookie(TokenController.stateKey, { state })
      .cookie(TokenController.contextKey, { id: query.uid })
      .json({
        url: `${this.configService.get(
          'SPOTIFY_BASE_URL',
        )}/authorize?${queryParams}`,
      });
  }

  @Get('/callback')
  public async getCallback(
    @Query() query: CallbackQueryDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const stateCookie = request.cookies[TokenController.stateKey];
    const contextCookie = request.cookies[TokenController.contextKey];

    response
      .clearCookie(TokenController.stateKey)
      .clearCookie(TokenController.contextKey);

    if (query.error) {
      response.redirect(
        `${this.configService.get('CLIENT_BASE_URL')}${
          TokenController.signUpStatusPath
        }denied`,
      );
    }

    const { code, state } = query;

    if (stateCookie.state !== state) {
      response.redirect(
        `${this.configService.get('CLIENT_BASE_URL')}${
          TokenController.signUpStatusPath
        }error`,
      );
    }

    try {
      const reqBody = this.transofrmSearchParams({
        code,
        redirect_uri: this.configService.get('SPOTIFY_REDIRECT_URI'),
        grant_type: 'authorization_code',
      });

      const { access_token, refresh_token } =
        await this.tokenService.getInitalToken(reqBody);

      await this.firestoreService.setUserDocSpotifyMap({
        accessToken: access_token,
        refreshToken: refresh_token,
        uid: contextCookie.id,
      });

      response.redirect(
        `${this.configService.get('CLIENT_BASE_URL')}${
          TokenController.signUpStatusPath
        }success`,
      );
    } catch (error) {
      response.redirect(
        `${this.configService.get('CLIENT_BASE_URL')}${
          TokenController.signUpStatusPath
        }error`,
      );
    }
  }

  private transofrmSearchParams(params: Record<string, string>) {
    return new URLSearchParams(params).toString();
  }
}
