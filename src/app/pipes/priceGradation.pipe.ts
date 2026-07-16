import {Pipe, PipeTransform} from "@angular/core";
import {PriceGradationEnum} from "../models/trainers/price.gradation.enum";

@Pipe({
  name: 'priceGradation',
  standalone: true
})
export class PriceGradationPipe implements PipeTransform {
  transform(value?: PriceGradationEnum, capitalLetter: boolean = false): string {
    function capitalizeFirstLetter(str: string): string {
      if (!str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    let result = capitalLetter ? capitalizeFirstLetter('undefined') : 'undefined';

    if(!value) return result;

    let priceGradationOptions = [
      {key: PriceGradationEnum.Lesson, name: "занятие"},
      {key: PriceGradationEnum.Day, name: "день"},
      {key: PriceGradationEnum.Week, name: "неделя"},
      {key: PriceGradationEnum.Month, name: "месяц"}
    ];

    for(let i = 0; i < priceGradationOptions.length; i++)
      if(priceGradationOptions[i].key === value) {
        result = priceGradationOptions[i].name;
        break;
      }

    return capitalLetter ? capitalizeFirstLetter(result) : result;
  }
}
