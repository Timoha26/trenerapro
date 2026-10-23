import {Pipe, PipeTransform} from "@angular/core";
import {CategoryModel} from "../models/category.model";

@Pipe({
  name: 'categoriesListener',
  standalone: true
})
export class CategoriesListenerPipe implements PipeTransform {
  transform(categories?: CategoryModel[]): string {
    if (!categories) return '';

    let categoriesNames: string[] = [];

    categories.forEach(category => categoriesNames.push(category.name ?? 'undefined'));

    return categoriesNames.join(', ');
  }
}
