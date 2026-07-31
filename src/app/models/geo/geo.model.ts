import {GeoAddressModel} from "./geo.address.model";

export interface GeoModel {
  place_id?: number;
  licence?: string;
  osm_type?: string;
  osm_id?: number;
  lat?: string;
  lon?: string;
  category?: string;
  type?: string;
  place_rank?: number;
  importance?: number;
  addresstype?: number;
  name?: string;
  display_name?: string;
  address?: GeoAddressModel;
  boundingbox?: string[];
}
