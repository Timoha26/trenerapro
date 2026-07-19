import {Injectable} from "@angular/core";
import {GenderEnum} from "../models/trainers/gender.enum";
import {PriceGradationEnum} from "../models/trainers/price.gradation.enum";
import {createMask, InputmaskOptions} from "@ngneat/input-mask";
import {FileUploadModel} from "../models/file.upload.model";
import {FileTypeEnum} from "../models/file.type.enum";
import {SportModel} from "../models/sport.model";

@Injectable()
export class CommonService {
  constructor() {
  }

  public getGenderOptions(): any {
    return [
      {key: GenderEnum.Male, name: "Мужщина"},
      {key: GenderEnum.Female, name: "Женщина"}
    ];
  }

  public getPriceGradationOptions(): any {
    return [
      {key: PriceGradationEnum.Lesson, name: "Занятие"},
      {key: PriceGradationEnum.Day, name: "День"},
      {key: PriceGradationEnum.Week, name: "Неделя"},
      {key: PriceGradationEnum.Month, name: "Месяц"}
    ];
  }

  public getPriceMask(): InputmaskOptions<any> {
    return createMask({
      alias: 'currency',
      rightAlign: false,
      suffix: ' ₽',
      unmaskAsNumber: true
    });
  }

  public isImage(file: FileUploadModel): boolean {
    if (file.type === undefined) return false;

    const type = file.type as FileTypeEnum;

    return type == FileTypeEnum.Avatar || type == FileTypeEnum.Logo || type == FileTypeEnum.Photo;
  }

  public isNotImage(file: FileUploadModel): boolean {
    if (file.type === undefined) return false;

    const type = file.type as FileTypeEnum;

    return type == FileTypeEnum.Video || type == FileTypeEnum.Document;
  }

  public getIndexInArrayById(fileId: number, array?: any[]): number {
    if (!array) return -1;

    for (let i = 0; i < array.length; i++)
      if (array[i].id == fileId)
        return i;

    return -1;
  }
}
