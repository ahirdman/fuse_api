import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UserBodyDto {
  @IsNotEmpty()
  public readonly uid: string;
}

export class CallbackQueryDto {
  @IsOptional()
  public readonly error?: string;

  @IsNotEmpty()
  public readonly code: string;

  @IsUUID()
  public readonly state: string;
}

export class AuthorizedTokenResponse {
  @IsNotEmpty()
  public readonly access_token: string;

  @IsNotEmpty()
  public readonly token_type: string;

  @IsNotEmpty()
  public readonly scope: string;

  @IsNumber()
  public readonly expires_in: number;

  @IsNotEmpty()
  public readonly refresh_token: string;
}

export class RefreshTokenResponse {
  @IsNotEmpty()
  public readonly access_token: string;

  @IsNotEmpty()
  public readonly token_type: string;

  @IsNotEmpty()
  public readonly scope: string;

  @IsNumber()
  public readonly expires_in: number;
}
