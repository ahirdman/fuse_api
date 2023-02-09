import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Req,
  Res,
} from '@nestjs/common';
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
      client_id: this.configService.get('CLIENT_ID'),
      scope: this.configService.get('AUTH_SCOPE'),
      redirect_uri: this.configService.get('REDIRECT_URI'),
      state,
    });

    response
      .cookie(TokenController.stateKey, { state })
      .cookie(TokenController.contextKey, { id: query.uid })
      .json({
        url: `${this.configService.get('BASE_URL')}/authorize?${queryParams}`,
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
      response.redirect('http://127.0.0.1:3030/signup/spotify?status=denied');
    }

    const { code, state } = query;

    if (stateCookie.state !== state) {
      response.redirect(
        'http://127.0.0.1:3030/signup/spotify?status=missmatch',
      );
    }

    try {
      const reqBody = this.transofrmSearchParams({
        code,
        redirect_uri: this.configService.get('REDIRECT_URI'),
        grant_type: 'authorization_code',
      });

      const { access_token, refresh_token } =
        await this.tokenService.getInitalToken(reqBody);

      await this.firestoreService.setUserDocSpotifyMap({
        accessToken: access_token,
        refreshToken: refresh_token,
        uid: contextCookie.id,
      });

      response.redirect('http://127.0.0.1:3030/signup/spotify?status=success');
    } catch (error) {
      response.redirect('http://127.0.0.1:3030/signup/spotify?status=error');
    }
  }

  private transofrmSearchParams(params: Record<string, string>) {
    return new URLSearchParams(params).toString();
  }
}
