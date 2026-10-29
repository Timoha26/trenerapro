import {ScheduleModel} from "./schedule.model";

export interface ScheduleResponseModel {
  id?: number;
  trainerId?: number;
  schedule?: ScheduleModel[];
}
