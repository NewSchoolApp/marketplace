import { IsDate, IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class ContentDTO {
  // Usado pra quando o usuário vai pegar o produto na NewSchool
  @IsOptional()
  @IsDate()
  withdrawalDate?: Date;
}

export class InitOrderDTO {
  @IsString()
  itemId: string;
  @IsString()
  userId: string;
  @IsNumber()
  @Min(1)
  quantity: number;
  @IsOptional()
  content?: ContentDTO;
}
