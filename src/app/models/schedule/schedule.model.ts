import {DayOfWeeksEnum} from "./dayOfWeeks.enum";

export interface ScheduleModel {
  dayOfWeek: DayOfWeeksEnum;
  startTime: string;
  endTime: string;
  dayOff: boolean;
}
