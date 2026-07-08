import {TrainerCreateModel} from "./trainer.create.model";


export interface TrainerCreateRequestModel {
  createTrainer: TrainerCreateModel;
  settlementId?: number;
  sportIds: number[];
  trainingFormatIds: number[];
  clientCategoryIds: number[];
  uploadedFileIds: number[];
}
