import { IResponse } from "@iota/iota.js-stardust";

export interface IDistributionEntry {
    addressCount: string;
    totalBalance: string;
    range: { start: number; end: number }[];
}

export interface ITokenDistributionResponse extends IResponse {
    distribution?: IDistributionEntry[];
    ledgerIndex?: number;
}
