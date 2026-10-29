import {GenderEnum} from "./gender.enum";
import {PriceGradationEnum} from "./price.gradation.enum";

export interface TrainerCreateModel {
  firstname?: string;
  lastname?: string;
  patronymic?: string;
  age?: number;
  experience?: number;
  trainingExperience?: number; //тренерский стаж
  gender?: GenderEnum;
  price?: number;
  priceGradation?: PriceGradationEnum;
  description?: string;
  education?: string; //образование
  area?: string; //область\направление
  specialization?: string; //специализация
}
