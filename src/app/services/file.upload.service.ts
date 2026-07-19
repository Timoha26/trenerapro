import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {conf} from "../conf/conf";
import {FileTypeEnum} from "../models/file.type.enum";

@Injectable()
export class FileUploadService {

  constructor(private http: HttpClient) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/files' + path;
  }

  public upload(file: File, fileType: FileTypeEnum, trainerId?: number, clubId?: number): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file, file.name);
    formData.append('type', fileType);

    if (trainerId)
      formData.append('trainerId', trainerId.toString());

    if (clubId)
      formData.append('clubId', clubId.toString());

    return this.http.post(this.getUrl(''), formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  public remove(fileId: number): Observable<any> {
    return this.http.delete(this.getUrl(''));
  }
}
