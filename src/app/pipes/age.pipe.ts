import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {
  transform(age?: number): string {
    if (!age)
      age = 0;

    return `${age} ${this.getSuffix(age)}`;
  }

  private getSuffix(age: number): string {
    const remainder10 = age % 10;
    const remainder100 = age % 100;

    if (remainder100 >= 11 && remainder100 <= 19)
      return 'лет';

    if (remainder10 === 1)
      return 'год';

    if (remainder10 >= 2 && remainder10 <= 4)
      return 'года';

    return 'лет';
  }
}
