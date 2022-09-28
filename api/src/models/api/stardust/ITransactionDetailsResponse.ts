import { IBlock } from "@iota/iota.js-stardust";
import { IResponse } from "../IResponse";

export interface ITransactionDetailsResponse extends IResponse {
    /**
     * Transaction included block.
     */
    block?: IBlock;
}