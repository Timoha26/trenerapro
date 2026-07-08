import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {conf} from "../conf/conf";
import {FileTypeEnum} from "../models/file.type.enum";

@Injectable()
export class FileUploadService {

  constructor(private http: HttpClient) {
  }

  public upload(file: File, fileType: FileTypeEnum): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file, file.name);
    formData.append('type', fileType);

    return this.http.post(conf.trainerProUrl + '/api/v1/files', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
