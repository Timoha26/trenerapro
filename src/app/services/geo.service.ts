import {Injectable, signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {conf} from "../conf/conf";
import {Observable} from "rxjs";
import {SettlementModel} from "../models/settlement.model";

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
