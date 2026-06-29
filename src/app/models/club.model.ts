import {SettlementModel} from "./settlement.model";

export interface ClubModel{
  id?: number;
  name?: string;
  address?: string;
  description?: string;
  logoUrl?: string;
  verified?: boolean;
  settlement?: SettlementModel;
  sports?: string[];
}
