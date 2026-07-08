import {UserModel} from "../users/user.model";

export interface ReviewModel {
  id?: number;
  text?: string;
  rating?: number;
  createdAt?: Date;
  user?: UserModel;
}
