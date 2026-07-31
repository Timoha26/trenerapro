import {SettlementModel} from "../settlement.model";

export interface LocationCreateModel {
  address?: string;
  settlementId?: number;
  trainerId?: number;
  clubId?: number;
  lon?: number;
  lat?: number;
  settlement?: SettlementModel;
}
