import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { UserDTO } from '../../UserModule/dto/user.dto';

export class UserJWTDTO extends UserDTO {
  @Expose()
  role: RoleJWTDTO;
}

export class RoleJWTDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Type(() => PolicyJWTDTO)
  @IsNotEmpty()
  @Expose()
  policies: PolicyJWTDTO[];
}

export class PolicyJWTDTO {
  @Expose()
  id: string;
  @Expose()
  name: string;
}
