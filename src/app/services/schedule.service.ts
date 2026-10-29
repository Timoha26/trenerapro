import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ScheduleResponseModel} from "../models/schedule/schedule.response.model";
import {conf} from "../conf/conf";
import {ScheduleUpdateModel} from "../models/schedule/schedule.update.model";
import {DayOfWeeksEnum} from "../models/schedule/dayOfWeeks.enum";
import {ScheduleModel} from "../models/schedule/schedule.model";

@Injectable({providedIn: 'root'})
export class ScheduleService {
  constructor(private http: HttpClient) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/work_schedule/trainer' + path;
  }

  public get(trainerId: number): Observable<ScheduleResponseModel> {
    return this.http.get(this.getUrl('/' + trainerId));
  }

  public create(trainerId: number, data: ScheduleUpdateModel): Observable<ScheduleResponseModel> {
    return this.http.post(this.getUrl('/' + trainerId), data);
  }

  public update(trainerId: number, data: ScheduleUpdateModel): Observable<ScheduleResponseModel> {
    return this.http.put(this.getUrl('/' + trainerId), data);
  }

  public getEmptyData(): ScheduleModel[] {
    return [
      {
        dayOfWeek: DayOfWeeksEnum.Monday,
        startTime: '08:00',
        endTime: '17:00',
        dayOff: false
      },
      {
        dayOfWeek: DayOfWeeksEnum.Tuesday,
        startTime: '08:00',
        endTime: '17:00',
        dayOff: false
      },
      {
        dayOfWeek: DayOfWeeksEnum.Wednesday,
        startTime: '08:00',
        endTime: '17:00',
        dayOff: false
      },
      {
        dayOfWeek: DayOfWeeksEnum.Thursday,
        startTime: '08:00',
        endTime: '17:00',
        dayOff: false
      },
      {
        dayOfWeek: DayOfWeeksEnum.Friday,
        startTime: '08:00',
        endTime: '17:00',
        dayOff: false
      },
      {
        dayOfWeek: DayOfWeeksEnum.Saturday,
        startTime: '00:00',
        endTime: '00:00',
        dayOff: true
      },
      {
        dayOfWeek: DayOfWeeksEnum.Sunday,
        startTime: '00:00',
        endTime: '00:00',
        dayOff: true
      }
    ];
  }
}
