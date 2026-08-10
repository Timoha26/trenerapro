import {Injectable, signal} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {conf} from "../conf/conf";
import {Observable} from "rxjs";
import {SettlementModel} from "../models/settlement.model";
import {GeoModel} from "../models/geo/geo.model";

@Injectable({providedIn: 'root'})
export class GeoService {
  constructor(private http: HttpClient) {
  }

  public settlements = signal<SettlementModel[]>([]);

  public currentSettlement = signal<SettlementModel | undefined>(undefined);

  private moscowGuid: string = "0c5b2444-70a0-4932-980c-b4dc0d3f02b5";

  public getSettlements(): Observable<any> {
    return new Observable<any>(subscriber => {
      this.http.get<SettlementModel[]>(conf.trainerProUrl + '/api/v1/settlements')
        .subscribe({
          next: data => {
            this.settlements.set(data);

            this.loadSavedSettlements(data);

            subscriber.next(true);
            subscriber.complete();
          },
          error: () => subscriber.error()
        });
    });
  }

  public selectSettlement(settlement: SettlementModel): void {
    this.currentSettlement.set(settlement);
    localStorage.setItem("user_settlement", JSON.stringify(settlement));
  }

  public getGeoCode(settlement: string, address: string): Observable<GeoModel[]> {
    let params: HttpParams = new HttpParams()
      .set('addressdetails', '1')
      .set('format', 'jsonv2')
      .set('limit', '1')
      .set('country', conf.country)
      .set('city', settlement)
      .set('street', address);

    return this.http.get<GeoModel[]>(conf.nominatimUrl + '/search', {
      params: params
    });
  }

  public getGeoUser(): Observable<GeolocationPosition> {
    return new Observable(observer => {
      if(!window.navigator.geolocation){
        observer.error("no geolocation in browser");
        return;
      }

      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  private loadSavedSettlements(settlements: SettlementModel[]) {
    const saved = localStorage.getItem("user_settlement");

    if (saved)
      this.currentSettlement.set(JSON.parse(saved))
    else
      this.detectSettlementsByIP(settlements);
  }

  private detectSettlementsByIP(settlements: SettlementModel[]): void {
    const moscow = settlements.find(settlement => settlement.guid == this.moscowGuid);

    this.currentSettlement.set(moscow);
  }
}
