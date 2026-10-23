import {Component, EventEmitter, OnInit} from "@angular/core";
import {CategoryModel} from "../../../../models/category.model";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {CategoriesService} from "../../../../services/categories.service";
import {FormsModule} from "@angular/forms";
import {FileUploadModel} from "../../../../models/file.upload.model";
import {FileUploadService} from "../../../../services/file.upload.service";
import {FileTypeEnum} from "../../../../models/file.type.enum";
import {HttpEvent, HttpEventType} from "@angular/common/http";

@Component({
  selector: 'category-create-modal',
  templateUrl: 'category.create.modal.component.html',
  imports: [
    FormsModule
  ],
  standalone: true
})
export class CategoryCreateModalComponent implements OnInit {
  parentId?: number = undefined;

  event: EventEmitter<CategoryModel> = new EventEmitter<CategoryModel>();

  newCategory: CategoryModel = {};

  uploadProgress: number = 0;

  private file?: File = undefined;

  fileType: FileTypeEnum = FileTypeEnum.Logo;

  constructor(private modalRef: BsModalRef,
              private toastr: ToastrService,
              private categoriesService: CategoriesService,
              private fileUploadService: FileUploadService) {
  }

  ngOnInit() {
    this.newCategory = {
      name: undefined,
      icon: 'fa-hand-fist',
      parentId: this.parentId
    };
  }

  private saveCategory() {
    this.categoriesService.create(this.newCategory).subscribe({
      next: (data: CategoryModel) => {
        this.event.emit(data);
        this.toastr.success('Категория создана', 'Категория');
        this.modalRef.hide();
      },
      error: (error) => {
        this.toastr.error('Произошла ошибка', 'Категория');
      }
    });
  }

  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length < 1) {
      this.toastr.warning('файл не выбран', 'Загрузка файла');
      return;
    }

    this.file = input.files[0];
  }

  private saveFile() {
    if (!this.file) {
      this.toastr.warning('файл не выбран', 'Загрузка файла');
      return;
    }

    this.fileUploadService.upload(this.file, this.fileType, undefined, undefined)
      .subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total!);
          } else if (event.type === HttpEventType.Response) {
            this.uploadProgress = 0;
            const fileUpload: FileUploadModel = JSON.parse(JSON.stringify(event.body));

            if (fileUpload?.url) {
              this.toastr.success('файл загружен', 'Загрузка файла');
              this.newCategory.imageUrl = fileUpload.url;
              this.saveCategory();
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

  removeFile(fileId?: number) {
    if (!fileId) return;

    this.fileUploadService.remove(fileId).subscribe({
      next: data => this.toastr.success('файл удален', 'Загрузка файла')
    });
  }

  save() {
    this.saveFile();
  }

  cancel() {
    this.event.emit(undefined);
    this.modalRef.hide();
  }
}
