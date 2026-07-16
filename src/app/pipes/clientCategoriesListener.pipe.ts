import {Pipe, PipeTransform} from "@angular/core";
import {ClientCategoryModel} from "../models/client.category.model";

@Pipe({
  name: 'clientCategoriesListener',
  standalone: true
})
export class ClientCategoriesListenerPipe implements PipeTransform {
  transform(clientCategories?: ClientCategoryModel[]): string {
    if (!clientCategories) return '';

    let categoryNames: string[] = [];

    clientCategories.forEach(category => categoryNames.push(category.name ?? 'undefined'));

    return categoryNames.join(', ');
  }
}
