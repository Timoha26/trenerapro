import {Pipe, PipeTransform} from "@angular/core";
import {SportModel} from "../models/sport.model";

@Pipe({
  name: 'sportsListener',
  standalone: true
})
export class SportsListenerPipe implements PipeTransform {
  transform(sports?: SportModel[]): string {
    if (!sports) return '';

    let sportNames: string[] = [];

    sports.forEach(sport => sportNames.push(sport.name ?? 'undefined'));

    return sportNames.join(', ');
  }
}
