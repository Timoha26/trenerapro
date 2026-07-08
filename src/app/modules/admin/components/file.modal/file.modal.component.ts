import {Component, EventEmitter} from "@angular/core";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {HttpEvent, HttpEventType} from "@angular/common/http";
import {FileUploadService} from "../../../../services/file.upload.service";
import {FileUploadModel} from "../../../../models/file.upload.model";
import {FileTypeEnum} from "../../../../models/file.type.enum";

@Component({
  selector: 'admin-file-modal',
  templateUrl: 'file.modal.component.html'
})
export class FileModalComponent {
  event: EventEmitter<FileUploadModel> = new EventEmitter<FileUploadModel>();
  uploadProgress: number = 0;
  private file?: File = undefined;
  fileType?: FileTypeEnum = undefined;
  fileTypeOptions = [
    {key: FileTypeEnum.Avatar, name: "Аватарка"},
    {key: FileTypeEnum.Logo, name: "Логотип"},
    {key: FileTypeEnum.Photo, name: "Фото"},
    {key: FileTypeEnum.Video, name: "Видео"},
    {key: FileTypeEnum.Document, name: "Документ"}
  ];

  constructor(private modalRef: BsModalRef, private fileUploadService: FileUploadService, private toastr: ToastrService) {
  }

  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length < 1) {
      this.toastr.warning('файл не выбран', 'Загрузка файла');
      return;
    }

    this.file = input.files[0];
  }

  save() {
    if (!this.file) {
      this.toastr.warning('файл не выбран', 'Загрузка файла');
      return;
    }

    this.fileUploadService.upload(this.file, this.fileType ?? FileTypeEnum.Avatar).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total!);
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress = 0;
          const fileUpload: FileUploadModel = JSON.parse(JSON.stringify(event.body));

          if (fileUpload?.url) {
            this.toastr.success('файл загружен', 'Загрузка файла');
            this.event.emit(fileUpload);
            this.modalRef.hide();
          } else {
            this.toastr.error('нет пути к файлу', 'Загрузка файла');
          }
        }
      },
      error: (error) => {
        this.toastr.error('ошибка загрузки файла', 'Загрузка файла');
        this.uploadProgress = 0;
      }
    });
  }

  cancel() {
    this.event.emit(undefined);
    this.modalRef.hide();
  }
}
