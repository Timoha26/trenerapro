import {Injectable} from "@angular/core";
import {conf} from "../conf/conf";

@Injectable()
export class RestoreUrlService {
  constructor() {
  }

  public restoreUrl(url?: string): string {
    return conf.trainerProUrl + url;
  }
}
