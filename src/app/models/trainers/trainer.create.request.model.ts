import {TrainerCreateModel} from "./trainer.create.model";
import {LocationCreateModel} from "../locations/location.create.model";

export interface TrainerCreateRequestModel {
  createTrainer: TrainerCreateModel;
  sportIds: number[];
  trainingFormatIds: number[];
  clientCategoryIds: number[];
  uploadedFileIds: number[];
}
