import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'ratingRepeat',
  standalone: true
})
export class RatingRepeatPipe implements PipeTransform {
  transform(value?: number): boolean[] {
    let result = [false, false, false, false, false];

    if (!value || value < 0) return result;

    for (let i = 0; i < value; i++)
      result[i] = true;

    return result;
  }
}
