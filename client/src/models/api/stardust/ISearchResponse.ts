import { IBlock, IOutputResponse, IOutputsResponse } from "@iota/iota.js-stardust";
import { IBech32AddressDetails } from "../IBech32AddressDetails";
import { IResponse } from "../IResponse";
import { IMilestoneAnalyticStats } from "../stats/IMilestoneAnalyticStats";
import { IAssociatedOutputsResponse } from "./IAssociatedOutputsResponse";
import { IMilestoneDetailsResponse } from "./IMilestoneDetailsResponse";
import { ITransactionHistoryResponse } from "./ITransactionHistoryResponse";
import { INftRegistryDetailsResponse } from "./nft/INftRegistryDetailsResponse";

export interface ISearchResponse extends IResponse {
    /**
     * Block if it was found.
     */
    block?: IBlock;

    /**
     * The transaction included block.
     */
    transactionBlock?: IBlock;

    /**
     * Address details.
     */
    addressDetails?: IBech32AddressDetails;

    /**
     * Output if it was found (block will also be populated).
     */
    output?: IOutputResponse;

    /**
     * Outputs response.
     */
    taggedOutputs?: IOutputsResponse;

    /**
     * The outputIds of transaction history request.
     */
    historyOutputs?: ITransactionHistoryResponse;

    /**
     * Associated outputs of the address.
     */
    addressAssociatedOutputs?: IAssociatedOutputsResponse;

    /**
     * Alias id if it was found.
     */
    aliasId?: string;

    /**
     * Alias details.
     */
    aliasDetails?: IOutputResponse;

    /**
     * Foundry id if it was found.
     */
    foundryId?: string;

    /**
     * Foundry details.
     */
    foundryDetails?: IOutputResponse;

    /**
     * Nft id if it was found.
     */
    nftId?: string;

    /**
     * Nft outputs.
     */
    nftOutputs?: IOutputsResponse;

    /**
     * Nft details.
     */
    nftDetails?: IOutputResponse;

    /**
     * Nft registry details (mock).
     */
    nftRegistryDetails?: INftRegistryDetailsResponse;

    /**
     * Foundry outputs.
     */
    foundryOutputs?: IOutputsResponse;

    /**
     * Milestone if it was found.
     */
    milestone?: IMilestoneDetailsResponse;

    /**
     * Milestone chornicle stats.
     */
    milestoneStats?: IMilestoneAnalyticStats;

    /**
     * DiD identifier.
     */
    did?: string;
}