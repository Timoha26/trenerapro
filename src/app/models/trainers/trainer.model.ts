import {SettlementModel} from "../settlement.model";
import {ClubModel} from "../clubs/club.model";
import {GenderEnum} from "./gender.enum";
import {PriceGradationEnum} from "./price.gradation.enum";
import {TrainerLevelEnum} from "./trainer.level.enum";
import {RatingModel} from "../rating.model";
import {SportModel} from "../sport.model";
import {TrainingFormatModel} from "../training.format.model";
import {FileUploadModel} from "../file.upload.model";
import {ClientCategoryModel} from "../client.category.model";

export interface TrainerModel {
  id?: number;
  settlementId?: number;
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
  sports?: SportModel[];
  rating?: RatingModel;
  trainingFormats?: TrainingFormatModel[];
  files?: FileUploadModel[];
  clientCategories?: ClientCategoryModel[];
  lessonAddresses?: any[];
  public?: boolean;
}
