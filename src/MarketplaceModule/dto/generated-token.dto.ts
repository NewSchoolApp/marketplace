import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GeneratedTokenDTO {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  tokenType: string;

  @IsNotEmpty()
  @IsNumber()
  expiresIn: number;
}
