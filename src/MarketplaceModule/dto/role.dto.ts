import { PolicyDTO } from './policy.dto';

export class RoleDTO {
  id: string;
  name: string;
  policies: PolicyDTO[];
}
