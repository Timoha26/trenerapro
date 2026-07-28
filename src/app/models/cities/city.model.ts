import {NamecaseModel} from "./namecase.model";
import {RegionModel} from "./region.model";
import {CoordsModel} from "./coords.model";
import {TimezoneModel} from "./timezone.model";

export interface CityModel {
  "name": string;
  "name_alt": string;
  "label": string;
  "type": string;
  "typeShort": string;
  "contentType": string;
  "id": string;
  "okato": string;
  "oktmo": string;
  "guid": string;
  "isDualName": boolean;
  "isCapital": boolean;
  "zip": number;
  "population": number;
  "yearFounded": number;
  "yearCityStatus": number;
  "name_en": string;
  "namecase": NamecaseModel,
  "coords": CoordsModel,
  "timezone": TimezoneModel,
  "regionName": string,
  "region": RegionModel
}
