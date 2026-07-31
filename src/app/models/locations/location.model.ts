import {SettlementModel} from "../settlement.model";

export interface LocationModel {
  id?: number;
  address?: string;
  settlementId?: number;
  settlement?: SettlementModel;
  trainerId?: number;
  clubId?: number;
  lon?: number;
  lat?: number;
}
