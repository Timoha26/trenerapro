import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {conf} from "../conf/conf";
import {Observable} from "rxjs";
import {PageResultModel} from "../models/page.result.model";
import {ReviewFiltersModel} from "../models/reviews/review.filters.model";
import {ReviewModel} from "../models/reviews/review.model";
import {ReviewCreateModel} from "../models/reviews/review.create.model";
import {UserModel} from "../models/users/user.model";
import {RoleEnum} from "../models/users/role.enum";
import {fakerRU as faker} from "@faker-js/faker";

@Injectable()
export class ReviewsService {
  constructor(private http: HttpClient) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/reviews' + path;
  }

  public get(filters?: ReviewFiltersModel): Observable<PageResultModel<ReviewModel>> {
    const createFakeUser = (): UserModel => ({
      id: faker.number.int(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      avatarUrl: faker.image.avatar(),
      role: RoleEnum.guest
    });

    const params: HttpParams = new HttpParams()
      .set('offset', filters?.offset ?? 0)
      .set('limit', filters?.limit ?? 6);

    return new Observable<any>(subscriber => {
      this.http.get<PageResultModel<ReviewModel>>(this.getUrl(''), {
        params: params
      }).subscribe({
        next: data => {
          data.items?.forEach(review => {
            review.user = createFakeUser()
          });

          subscriber.next(data);
          subscriber.complete();
        },
        error: error => subscriber.error(error)
      });
    });
  }

  public create(data: ReviewCreateModel): Observable<ReviewModel> {
    return this.http.post<ReviewModel>(this.getUrl(''), data);
  }
}
