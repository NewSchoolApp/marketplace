import { IsDate, IsOptional, IsString } from 'class-validator';

export class ContentDTO {
  // Usado pra quando o usuário vai pegar o produto na NewSchool
  @IsOptional()
  @IsDate()
  withdrawlDate?: Date;
}

export class InitOrderDTO {
  @IsString()
  itemId: string;
  @IsString()
  userId: string;
  @IsOptional()
  content?: ContentDTO;
}
