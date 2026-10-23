import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {CategoryModel} from "../models/category.model";
import {conf} from "../conf/conf";
import {CommonService} from "./common.service";

@Injectable({providedIn: 'root'})
export class CategoriesService {
  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/sports' + path;
  }

  public get(): Observable<CategoryModel[]> {
    return this.http.get<any[]>(this.getUrl('')).pipe(
      map((response): CategoryModel[] =>
        response.map((item): CategoryModel => ({
          id: item.id,
          name: item.name,
          icon: item.icon,
          imageUrl: this.commonService.restoreUrl(item.imageUrl),
          parentId: item.parentSportId
        }))
      )
    );
  }

  public create(data: CategoryModel): Observable<CategoryModel> {
    const request = {
      id: data.id,
      name: data.name,
      icon: data.icon,
      imageUrl: data.imageUrl,
      parentSportId: data.parentId
    };

    return this.http.post<any>(this.getUrl(''), request).pipe(
      map((response): CategoryModel => {
        return {
          id: response.id,
          name: response.name,
          icon: response.icon,
          imageUrl: response.imageUrl,
          parentId: response.parentSportId
        };
      })
    );
  }

  public remove(id: number): Observable<any> {
    return this.http.delete<any>(this.getUrl('/' + id));
  }
}
