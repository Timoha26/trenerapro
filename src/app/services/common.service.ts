import {Injectable, signal} from "@angular/core";
import {GenderEnum} from "../models/trainers/gender.enum";
import {PriceGradationEnum} from "../models/trainers/price.gradation.enum";
import {createMask, InputmaskOptions} from "@ngneat/input-mask";
import {FileUploadModel} from "../models/file.upload.model";
import {FileTypeEnum} from "../models/file.type.enum";
import {conf} from "../conf/conf";
import {UserModel} from "../models/users/user.model";
import {fakerRU as faker, SexType} from "@faker-js/faker";
import {RoleEnum} from "../models/users/role.enum";
import {GlobalFiltersModel} from "../models/global.filters.model";
import {CoordsModel} from "../models/coords.model";
import {SortByEnum} from "../models/sortBy.enum";
import {SortOptionModel} from "../models/sort.option.model";
import {CategoryModel} from "../models/category.model";
import {CategoryTreeModel} from "../models/category.tree.model";
import {CategoryChainModel} from "../models/category.chain.model";

@Injectable({providedIn: 'root'})
export class CommonService {
  constructor() {
  }

  public globalFilters = signal<GlobalFiltersModel>({limit: 4, distance: 10});

  public onChangeGlobalCategoryId(categoryId?: number) {
    this.globalFilters.update(state => ({
      ...state,
      categoryId: categoryId
    }));
  }

  public onChangeGlobalSettlement(settlementId?: number, lat?: number, lon?: number) {
    let coords: CoordsModel | undefined = undefined;

    if (lat && lon)
      coords = {lat: lat, lon: lon};

    this.globalFilters.update(state => ({
      ...state,
      settlementId: settlementId,
      coords: coords
    }));
  }

  public onChangeUserGlobalCoords(lat?: number, lon?: number) {
    let coords: CoordsModel | undefined = undefined;

    if (lat && lon)
      coords = {lat: lat, lon: lon};

    this.globalFilters.update(state => ({
      ...state,
      userCoords: coords
    }));
  }

  public onChangeGlobalLimit(limit?: number) {
    if (!limit)
      limit = 4;

    this.globalFilters.update(state => ({
      ...state,
      limit: limit
    }));
  }

  public onChangeGlobalDistance(distance?: number) {
    if (!distance)
      distance = 10;

    this.globalFilters.update(state => ({
      ...state,
      distance: distance
    }));
  }

  public onChangeGlobalSort(sortOption?: SortOptionModel) {
    if (!sortOption)
      sortOption = {
        sort: SortByEnum.Rating,
        desc: true,
        name: "По рейтингу"
      };

    this.globalFilters.update(state => ({
      ...state,
      sort: sortOption?.sort,
      desc: sortOption?.desc
    }));
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

  public buildCategoriesTree(categories: CategoryModel[]): CategoryTreeModel[] {
    const map: Record<number, CategoryTreeModel> = {};
    const tree: CategoryTreeModel[] = [];

    categories.forEach(item => {
      map[item.id ?? 0] = {...item, subCategories: []};
    });

    categories.forEach(item => {
      const category = map[item.id ?? 0];
      if (!item.parentId || !map[item.parentId]) {
        tree.push(category);
      } else {
        map[item.parentId].subCategories.push(category);
      }
    });

    //для того что меню не лезло дальше второго уровня
    tree.forEach(item => {
      item.subCategories.forEach(subCategory => subCategory.parentId = undefined);
    });

    return tree;
  }

  public getSubCategoriesById(categories: CategoryTreeModel[], parentId?: number): CategoryTreeModel[] | null {
    for (const category of categories) {
      if (category.id == parentId)
        return category.subCategories;

      if (category.subCategories && category.subCategories.length > 0) {
        const foundSubCategories = this.getSubCategoriesById(category.subCategories, parentId);

        if (foundSubCategories !== null)
          return foundSubCategories;
      }
    }

    return null;
  }

  public getChainCategories(categoryId: number, allCategories: CategoryModel[]): CategoryChainModel[] {
    const chain: CategoryChainModel[] = [];

    let current = allCategories.find(category => category.id === categoryId);

    while (current) {
      chain.push({
        id: current?.parentId ? current.id : undefined,
        name: current.name,
        subCategoriesExist: allCategories.some(category => category.parentId == current?.id),
        parentId: current?.parentId
      });

      current = allCategories.find(category => category.id === current?.parentId);
    }

    return chain.reverse();
  }
}
