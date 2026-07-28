import {NamecaseModel} from "./namecase.model";
import {CapitalModel} from "./capital.model";

export interface RegionModel {
  "name": string;
  "label": string;
  "type": string;
  "typeShort": string;
  "contentType": string;
  "id": string;
  "okato": string;
  "oktmo": string;
  "guid": string;
  "code": string;
  "iso_3166-2": string;
  "population": number;
  "yearFounded": number;
  "area": number;
  "fullname": string;
  "unofficialName": string;
  "name_en": string;
  "district": string;
  "namecase": NamecaseModel,
  "capital": CapitalModel
}
