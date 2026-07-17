import {Pipe, PipeTransform} from "@angular/core";
import {TrainingFormatModel} from "../models/training.format.model";

@Pipe({
  name: 'trainingFormatsListener',
  standalone: true
})
export class TrainingFormatsListenerPipe implements PipeTransform{
  transform(trainingFormats?: TrainingFormatModel[]): any {
    if (!trainingFormats) return '';

    let formatNames: string[] = [];

    trainingFormats.forEach(format => formatNames.push(format.name ?? 'undefined'));

    return formatNames.join(', ');
  }
}
