import {Pipe, PipeTransform} from "@angular/core";
import {DayOfWeeksEnum} from "../models/schedule/dayOfWeeks.enum";

@Pipe({
  name: 'dayOfWeeks',
  standalone: true
})
export class DayOfWeeksPipe implements PipeTransform {
  transform(value?: DayOfWeeksEnum, useShortName: boolean = false): string {
    let result = 'undefined';

    let dayOfWeeksOptions = [
      {key: DayOfWeeksEnum.Monday, fullName: "Понедельник", shortName: "Пн"},
      {key: DayOfWeeksEnum.Tuesday, fullName: "Вторник", shortName: "Вт"},
      {key: DayOfWeeksEnum.Wednesday, fullName: "Среда", shortName: "Ср"},
      {key: DayOfWeeksEnum.Thursday, fullName: "Четверг", shortName: "Чт"},
      {key: DayOfWeeksEnum.Friday, fullName: "Пятница", shortName: "Пт"},
      {key: DayOfWeeksEnum.Saturday, fullName: "Суббота", shortName: "Сб"},
      {key: DayOfWeeksEnum.Sunday, fullName: "Воскресение", shortName: "Вс"}
    ];

    for (let i = 0; i < dayOfWeeksOptions.length; i++)
      if (dayOfWeeksOptions[i].key === value) {
        result = useShortName ? dayOfWeeksOptions[i].shortName : dayOfWeeksOptions[i].fullName;
        break;
      }

    return result;
  }
}
