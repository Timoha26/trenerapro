import {TrainerCreateModel} from "./trainer.create.model";


export interface TrainerCreateRequestModel {
  createTrainer: TrainerCreateModel;
  sportIds: number[];
  trainingFormatIds: number[];
  clientCategoryIds: number[];
  uploadedFileIds: number[];
}
