import {Injectable} from "@angular/core";
import {conf} from "../conf/conf";

@Injectable()
export class RestoreUrlService {
  constructor() {
  }

  public restoreUrl(path?: string): string {
    return conf.filesUrl + path;
  }
}
