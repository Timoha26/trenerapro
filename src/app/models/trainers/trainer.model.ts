import {ClubModel} from "../clubs/club.model";
import {GenderEnum} from "./gender.enum";
import {PriceGradationEnum} from "./price.gradation.enum";
import {TrainerLevelEnum} from "./trainer.level.enum";
import {RatingModel} from "../rating.model";
import {CategoryModel} from "../category.model";
import {TrainingFormatModel} from "../training.format.model";
import {FileUploadModel} from "../file.upload.model";
import {ClientCategoryModel} from "../client.category.model";
import {ReviewModel} from "../reviews/review.model";
import {LocationModel} from "../locations/location.model";

export interface TrainerModel {
  id?: number;
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
  sports?: CategoryModel[];
  rating?: RatingModel;
  trainingFormats?: TrainingFormatModel[];
  files?: FileUploadModel[];
  clientCategories?: ClientCategoryModel[];
  lessonAddresses?: any[];
  public?: boolean;
  reviews?: ReviewModel[];
  locations?: LocationModel[];
}
