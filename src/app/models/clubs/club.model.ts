import {RatingModel} from "../rating.model";
import {TrainerModel} from "../trainers/trainer.model";
import {ContactModel} from "../contact.model";
import {FileUploadModel} from "../file.upload.model";
import {ReviewModel} from "../reviews/review.model";
import {SportModel} from "../sport.model";
import {LocationModel} from "../locations/location.model";

export interface ClubModel {
  id?: number;
  name?: string;
  description?: string;
  logoUrl?: string;
  verified?: boolean;
  sports?: SportModel[];
  rating?: RatingModel;
  trainers?: TrainerModel[];
  contacts?: ContactModel[];
  files?: FileUploadModel[];
  reviews?: ReviewModel[];
  public?: boolean;
  locations?: LocationModel[];
}
