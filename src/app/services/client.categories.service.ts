import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {conf} from "../conf/conf";
import {Observable} from "rxjs";
import {ClientCategoryModel} from "../models/client.category.model";

@Injectable()
export class ClientCategoriesService {
  constructor(private http: HttpClient) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/client_categories' + path;
  }

  public get(): Observable<ClientCategoryModel[]> {
    return this.http.get<ClientCategoryModel[]>(this.getUrl(''));
  }

  public create(data: ClientCategoryModel): Observable<ClientCategoryModel> {
    return this.http.post<ClientCategoryModel>(this.getUrl(''), data);
  }

  public remove(id: number): Observable<ClientCategoryModel> {
    return this.http.delete<ClientCategoryModel>(this.getUrl('/' + id));
  }
}
