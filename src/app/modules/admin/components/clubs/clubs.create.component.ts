import {Component} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {FileModalComponent} from "../file.modal/file.modal.component";
import {FileUploadModel} from "../../../../models/file.upload.model";
import {RestoreUrlService} from "../../../../services/restore.url.service";
import {ClubsService} from "../../../../services/clubs.service";
import {ClubCreateRequestModel} from "../../../../models/clubs/club.create.request.model";
import {FileUploadService} from "../../../../services/file.upload.service";
import {CommonService} from "../../../../services/common.service";

@Component({
  selector: 'admin-clubs-create',
  templateUrl: 'clubs.create.component.html'
})
export class ClubsCreateComponent {
  constructor(private router: Router,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private clubsService: ClubsService,
              private restoreUrlService: RestoreUrlService,
              private fileUploadService: FileUploadService,
              private commonService: CommonService) {
  }

  club = this.clubsService.getClubCreateRequestModel();

  files: FileUploadModel[] = [];

  private modalRef?: BsModalRef;

  addFile() {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md'
    };

    this.modalRef = this.modalService.show(FileModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (file: FileUploadModel) => {
        if (file) {
          file.url = this.restoreUrlService.restoreUrl(file.url);
          this.club.uploadedFileIds.push(file.id ?? 0);
          this.files.push(file);
        }
      }
    });
  }

  removeFile(fileId?: number) {
    if (!fileId) return;

    this.fileUploadService.remove(fileId).subscribe({
      next: data => this.toastr.success('файл удален', 'Загрузка файла')
    });
  }

  isImage(file: FileUploadModel) {
    return this.commonService.isImage(file);
  }

  isNotImage(file: FileUploadModel) {
    return this.commonService.isNotImage(file);
  }

  save() {
    let club: ClubCreateRequestModel = JSON.parse(JSON.stringify(this.club));

    this.clubsService.create(club).subscribe({
      next: data => {
        this.toastr.success('клуб сохранен', 'Клуб');
        this.router.navigate(['/admin/clubs/' + data.id + '/edit']);
      }
    });
  }
}
