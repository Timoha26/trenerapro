import {Injectable} from "@angular/core";
import {GenderEnum} from "../models/trainers/gender.enum";
import {PriceGradationEnum} from "../models/trainers/price.gradation.enum";
import {createMask, InputmaskOptions} from "@ngneat/input-mask";
import {FileUploadModel} from "../models/file.upload.model";
import {FileTypeEnum} from "../models/file.type.enum";
import {conf} from "../conf/conf";
import {UserModel} from "../models/users/user.model";
import {fakerRU as faker, SexType} from "@faker-js/faker";
import {RoleEnum} from "../models/users/role.enum";

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

  public restoreUrl(path?: string): string {
    return conf.filesUrl + path;
  }

  public isLogo(file: FileUploadModel): boolean {
    if (file.type === undefined) return false;

    const type = file.type as FileTypeEnum;

    return type == FileTypeEnum.Avatar || type == FileTypeEnum.Logo;
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

  public getFakeUser(): UserModel {
    const createFakeUser = (): UserModel => {
      const sex = faker.person.sex() as SexType;
      return ({
        id: faker.number.int(),
        firstName: faker.person.firstName(sex),
        lastName: faker.person.lastName(sex),
        avatarUrl: faker.image.avatar(),
        role: RoleEnum.guest
      })
    };

    return createFakeUser();
  }
}
