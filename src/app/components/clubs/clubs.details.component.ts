import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {RestoreUrlService} from "../../services/restore.url.service";
import {FileUploadModel} from "../../models/file.upload.model";
import {ClubModel} from "../../models/clubs/club.model";
import {ClubsService} from "../../services/clubs.service";
import {CommonService} from "../../services/common.service";

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

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private clubsService: ClubsService, private restoreUrlService: RestoreUrlService, private commonService: CommonService) {
    this.id = activatedRoute.snapshot.params['id'];
  }

  private getClub(id: number) {
    this.clubsService.getDetails(id).subscribe({
      next: data => {
        if (data.files) {
          data.files.forEach(file => {
            file.url = this.restoreUrlService.restoreUrl(file.url);

            if(this.commonService.isImage(file))
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

  ngOnInit() {
    if (this.id)
      this.getClub(this.id);
  }
}
