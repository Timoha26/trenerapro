import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {createMask} from "@ngneat/input-mask";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {TrainerModel} from "../../../../models/trainers/trainer.model";
import {TrainersService} from "../../../../services/trainers.service";

@Component({
  selector: 'admin-projects-edit',
  templateUrl: 'trainers.edit.component.html'
})
export class TrainersEditComponent {
  id: number | undefined;
  trainer: TrainerModel | undefined;
  modalRef?: BsModalRef;

  priceMask = createMask({
    alias: 'currency',
    rightAlign: false,
    suffix: ' ₽',
    unmaskAsNumber: true
  });

  constructor(private activatedRoute: ActivatedRoute, private modalService: BsModalService, private trainerService: TrainersService, private toastr: ToastrService) {
    this.id = activatedRoute.snapshot.params['id'];
  }

  private getProject(id: number) {
    this.trainerService.getDetails(id).subscribe({
      next: data => {
        this.trainer = data;
      }
    });
  }

  addImage() {
    // if (!this.trainer) return;
    //
    // const imageModalOptions: ModalOptions = {
    //   class: 'modal-dialog-centered modal-md',
    //   initialState: {
    //     projectId: this.id,
    //     imagesCount: this.trainer.images.length
    //   }
    // };
    //
    // this.modalRef = this.modalService.show(ImageModalComponent, imageModalOptions);
    //
    // this.modalRef.content.event.subscribe({
    //   next: (image: ImageModel) => {
    //     if (image && this.project) {
    //       image.url = this.restoreUrlService.restoreUrl(image.url);
    //       this.project.images.push(image);
    //     }
    //   }
    // });
  }

  removeImage(imageId?: number) {
    // if (!this.project || !imageId) return;
    //
    // this.imagesService.remove(imageId).subscribe({
    //   next: data => {
    //     this.toastr.success('изображение удалено', 'Изображение');
    //
    //     if (this.project)
    //       for (let i = 0; i < this.project.images.length; i++)
    //         if (this.project.images[i].id == imageId) {
    //           this.project.images.splice(i, 1);
    //           break;
    //         }
    //   }
    // });
  }

  updateImage(image: any) {
    // const data: ImageUpdateModel = {
    //   name: image.name,
    //   mainImage: !image.mainImage
    // };
    //
    // console.log(data);
    //
    // this.imagesService.update(image.id, data).subscribe({
    //   next: () => {
    //     this.getProject(this.id ?? '');
    //   }
    // });
  }

  addPdf() {
    // if (!this.project) return;
    //
    // const pdfModalOptions: ModalOptions = {
    //   class: 'modal-dialog-centered modal-md',
    //   initialState: {
    //     projectId: this.id
    //   }
    // };
    //
    // this.modalRef = this.modalService.show(PdfModalComponent, pdfModalOptions);
    //
    // this.modalRef.content.event.subscribe({
    //   next: (project: ProjectModel) => {
    //     if (project && this.project) {
    //       project.pdfUrls = this.restoreUrlService.restorePdfUrls(project.pdfUrls ?? []);
    //       this.project.pdfUrls = project.pdfUrls;
    //     }
    //   }
    // });
  }

  save() {
    let trainer: TrainerModel = JSON.parse(JSON.stringify(this.trainer));

    if (trainer.price)
      trainer.price = parseFloat(trainer.price.toString().replace(/[^0-9.]/g, ''));

    // this.trainerService.update(trainer).subscribe({
    //   next: data => {
    //     this.toastr.success('проект сохранен', 'Проект');
    //   }
    // });
  }

  ngOnInit() {
    if (this.id)
      this.getProject(this.id);
  }
}
