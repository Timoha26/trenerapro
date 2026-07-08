import {GenderEnum} from "./gender.enum";
import {PriceGradationEnum} from "./price.gradation.enum";

export interface TrainerCreateModel {
  firstname?: string;
  lastname?: string;
  patronymic?: string;
  age?: number;
  experience?: number;
  gender?: GenderEnum;
  price?: number;
  priceGradation?: PriceGradationEnum;
  description?: string;
}
