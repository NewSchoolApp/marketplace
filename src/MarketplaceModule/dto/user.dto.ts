import { EscolarityEnum } from '../enum/escolarity.enum';
import { GenderEnum } from '../enum/gender.enum';
import { UserProfileEnum } from '../enum/user-profile.enum';
import { RoleDTO } from './role.dto';

export class UserDTO {
  id: string;
  name: string;
  email: string;
  profile: UserProfileEnum;
  nickname?: string;
  birthday?: Date;
  gender?: GenderEnum;
  inviteKey: string;
  invitedByUserId: string;
  schooling?: EscolarityEnum;
  institutionName?: string;
  profession?: string;
  phone?: string;
  cep?: string;
  complement?: string;
  houseNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  urlFacebook?: string;
  urlInstagram?: string;
  role: RoleDTO;
  photo: string;
}
