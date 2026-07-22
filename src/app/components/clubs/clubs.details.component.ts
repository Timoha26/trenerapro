import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FileUploadModel} from "../../models/file.upload.model";
import {ClubModel} from "../../models/clubs/club.model";
import {ClubsService} from "../../services/clubs.service";
import {CommonService} from "../../services/common.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ReviewCreateModalComponent} from "../reviews/review.create.modal.component";
import {ReviewModel} from "../../models/reviews/review.model";

@Component({
  selector: 'landing-clubs-details',
  templateUrl: './clubs.details.component.html'
})
export class ClubsDetailsComponent {
  id: number | undefined;
  club: ClubModel = {
    id: undefined,
    settlement: undefined,
    name: undefined,
    description: undefined,
    verified: undefined,
    logoUrl: undefined,
    sports: undefined,
    rating: undefined,
    files: undefined,
    public: undefined
  };
  private modalRef?: BsModalRef;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private clubsService: ClubsService,
              private commonService: CommonService,
              private modalService: BsModalService) {
    this.id = activatedRoute.snapshot.params['id'];
  }

  private getClub(id: number) {
    this.clubsService.getDetails(id).subscribe({
      next: data => {
        if (data.files) {
          data.files.forEach(file => {
            file.url = this.commonService.restoreUrl(file.url);

            if(this.commonService.isLogo(file))
              data.logoUrl = file.url;
          });
        }

        this.club = data;
      }
    });
  }

  isImage(file: FileUploadModel) {
    return this.commonService.isImage(file);
  }

  isNotImage(file: FileUploadModel) {
    return this.commonService.isNotImage(file);
  }

  addReview(trainerId?: number, clubId?: number) {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md',
      initialState: {
        trainerId: trainerId,
        clubId: clubId
      }
    };

    this.modalRef = this.modalService.show(ReviewCreateModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (review: ReviewModel) => {
        console.log('review added');
      }
    });
  }

  ngOnInit() {
    if (this.id)
      this.getClub(this.id);
  }
}
