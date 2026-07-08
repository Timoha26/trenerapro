import {SettlementModel} from "../settlement.model";
import {ClubModel} from "../clubs/club.model";
import {GenderEnum} from "./gender.enum";
import {PriceGradationEnum} from "./price.gradation.enum";
import {TrainerLevelEnum} from "./trainer.level.enum";
import {RatingModel} from "../rating.model";

export interface TrainerModel {
  id?: number;
  settlement?: SettlementModel;
  firstname?: string;
  lastname?: string;
  patronymic?: string;
  age?: number;
  experience?: number;
  gender?: GenderEnum;
  price?: number;
  priceGradation?: PriceGradationEnum;
  description?: string;
  club?: ClubModel;
  verified?: boolean;
  level?: TrainerLevelEnum;
  logoUrl?: string;
  sports?: string[];
  rating?: RatingModel;
  public?: boolean;
}
