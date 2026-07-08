import {RoleEnum} from "./role.enum";

export interface UserModel {
  id?: number;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: RoleEnum;
}
