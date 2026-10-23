import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {FileUploadModel} from "../../../../models/file.upload.model";
import {ClubModel} from "../../../../models/clubs/club.model";
import {ClubsService} from "../../../../services/clubs.service";
import {CommonService} from "../../../../services/common.service";
import {ClubCreateModel} from "../../../../models/clubs/club.create.model";
import {FileModalComponent} from "../file.modal/file.modal.component";
import {FileUploadService} from "../../../../services/file.upload.service";
import {LocationsService} from "../../../../services/locations.service";
import {LocationCreateModalComponent} from "../location/location.create.modal.component";
import {LocationCreateModel} from "../../../../models/locations/location.create.model";
import {LocationModel} from "../../../../models/locations/location.model";

@Component({
  selector: 'admin-clubs-edit',
  templateUrl: 'clubs.edit.component.html'
})
export class ClubsEditComponent {
  id: number | undefined;

  club: ClubModel = {};

  private modalRef?: BsModalRef;
  private deleteLocations: number[] = [];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private clubsService: ClubsService,
              private fileUploadService: FileUploadService,
              private commonService: CommonService,
              private locationsService: LocationsService) {
    this.id = activatedRoute.snapshot.params['id'];
  }

  private getClub(id: number) {
    this.clubsService.getDetails(id).subscribe({
      next: data => {
        if (data.files) {
          data.files.forEach(file => {
            file.url = this.commonService.restoreUrl(file.url);
          });
        }

        this.club = data;
      }
    });
  }

  addFile() {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md',
      initialState: {
        clubId: this.club.id
      }
    };

    this.modalRef = this.modalService.show(FileModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (file: FileUploadModel) => {
        if (file) {
          file.url = this.commonService.restoreUrl(file.url);

          if (!this.club.files)
            this.club.files = [];

          this.club.files.push(file);
        }
      }
    });
  }

  removeFile(fileId?: number) {
    if (!fileId) return;

    this.fileUploadService.remove(fileId).subscribe({
      next: data => {
        if (!this.club.files)
          this.club.files = [];

        let index = this.commonService.getIndexInArrayById(fileId, this.club.files);
        if (index > -1)
          this.club.files.splice(index, 1);

        this.toastr.success('файл удален', 'Загрузка файла');
      }
    });
  }

  addLocation() {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md'
    };

    this.modalRef = this.modalService.show(LocationCreateModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (location: LocationCreateModel) => {
        if (location)
          this.club.locations?.push(location);
      }
    });
  }

  removeLocation(location: LocationModel) {
    const index = this.club.locations?.findIndex(item => item.address == location.address) ?? -1;

    if (index < 0) return;

    this.club.locations?.splice(index, 1);

    if (!location.id) return;

    this.deleteLocations.push(location.id);
  }

  isImage(file: FileUploadModel) {
    return this.commonService.isImage(file);
  }

  isNotImage(file: FileUploadModel) {
    return this.commonService.isNotImage(file);
  }

  save() {
    this.updateClub();
    this.updateSports();
    this.updateLocations();
  }

  private updateClub() {
    const club: ClubCreateModel = {
      name: this.club.name,
      description: this.club.description
    };

    this.clubsService.update(this.club.id, club).subscribe({
      next: () => {
        this.toastr.success('клуб сохранен', 'Клуб');
        this.router.navigate(['/admin/clubs']);
      }
    });
  }

  private updateSports() {
    if (!this.club.id || !this.club.sports) return;

    const sportIds = this.club.sports.map(sport => sport.id ?? 0);

    this.clubsService.updateRelationsSports(this.club.id ?? 0, sportIds)
      .subscribe({
        next: () => this.toastr.success('клуб сохранен', 'Клуб')
      });
  }

  private updateLocations() {
    if (!this.club.locations || this.club.locations.length == 0) return;

    const newLocations = this.club.locations.filter(location => !location.id);

    newLocations.forEach(location => {
      location.clubId = this.club.id;

      this.locationsService.create(location).subscribe({
        next: data => {
          this.toastr.success('локация добавлена', 'Клуб');
        }
      });
    });

    this.deleteLocations.forEach(locationId => {
      this.locationsService.remove(locationId).subscribe({
        next: () => {
          this.toastr.success('локация удалена', 'Клуб');
        }
      });
    });
  }

  ngOnInit() {
    if (this.id)
      this.getClub(this.id);
  }
}
