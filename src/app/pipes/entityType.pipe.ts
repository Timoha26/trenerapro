import {Pipe, PipeTransform} from "@angular/core";
import {EntityTypeEnum} from "../models/search/entity.type.enum";

@Pipe({
  name: 'entityType',
  standalone: true
})
export class EntityTypePipe implements PipeTransform{
  transform(value?: EntityTypeEnum): string {
    let result = 'undefined';

    let entityTypeOptions = [
      {key: EntityTypeEnum.Trainer, name: "Тренер"},
      {key: EntityTypeEnum.Club, name: "Клуб"}
    ];

    for(let i = 0; i < entityTypeOptions.length; i++)
      if(entityTypeOptions[i].key === value) {
        result = entityTypeOptions[i].name;
        break;
      }

    return result;
  }
}
