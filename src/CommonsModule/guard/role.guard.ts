import {
  CanActivate,
  ExecutionContext,
  HttpService,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import axios, { AxiosError } from 'axios';
import { UserJWTDTO } from '../dto/user-jwt.dto';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: string[] =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];
    const policies: string[] =
      this.reflector.get<string[]>('policies', context.getHandler()) || [];
    if ((!roles && !policies) || (!roles.length && !policies.length)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) return false;

    let user: UserJWTDTO;
    try {
      const { data } = await this.httpService
        .post<UserJWTDTO>(
          this.configService.securityOauthTokenDetailsUrl,
          null,
          {
            headers: { authorization: authorizationHeader },
          },
        )
        .toPromise();
      user = data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error: AxiosError = e;
        if (error.response.status === 401) throw new UnauthorizedException();
        throw new InternalServerErrorException();
      }
      throw new InternalServerErrorException();
    }

    const hasRoles = roles.length
      ? roles.some((role) => role === user.role.name)
      : true;

    const hasPolicies = policies.length
      ? policies.some((policy) =>
          user.role.policies.some((userPolicy) => userPolicy.name === policy),
        )
      : true;

    return hasRoles || hasPolicies;
  }
}
