import {ClubCreateModel} from "./club.create.model";

export interface ClubCreateRequestModel{
  createClub: ClubCreateModel;
  sportIds: number[];
  contactIds: number[];
  uploadedFileIds: number[];
}
