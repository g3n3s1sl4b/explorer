import { FetchHelper } from "../../helpers/fetchHelper";
import { IMilestoneDetailsRequest } from "../../models/api/IMilestoneDetailsRequest";
import { IOutputDetailsRequest } from "../../models/api/IOutputDetailsRequest";
import { IAliasRequest } from "../../models/api/stardust/IAliasRequest";
import { IAliasResponse } from "../../models/api/stardust/IAliasResponse";
import { IAssociatedOutputsRequest } from "../../models/api/stardust/IAssociatedOutputsRequest";
import { IAssociatedOutputsResponse } from "../../models/api/stardust/IAssociatedOutputsResponse";
import { IBaseTokenGetRequest } from "../../models/api/stardust/IBaseTokenGetRequest";
import { IBaseTokenGetResponse } from "../../models/api/stardust/IBaseTokenGetResponse";
import { IBlockDetailsRequest } from "../../models/api/stardust/IBlockDetailsRequest";
import { IBlockDetailsResponse } from "../../models/api/stardust/IBlockDetailsResponse";
import { IFoundriesRequest } from "../../models/api/stardust/IFoundriesRequest";
import { IFoundriesResponse } from "../../models/api/stardust/IFoundriesResponse";
import { IFoundryRequest } from "../../models/api/stardust/IFoundryRequest";
import { IFoundryResponse } from "../../models/api/stardust/IFoundryResponse";
import { IMilestoneDetailsResponse } from "../../models/api/stardust/IMilestoneDetailsResponse";
import { INftAddressDetailsRequest } from "../../models/api/stardust/INftAddressDetailsRequest";
import { INftAddressDetailsResponse } from "../../models/api/stardust/INftAddressDetailsResponse";
import { INftDetailsRequest } from "../../models/api/stardust/INftDetailsRequest";
import { INftDetailsResponse } from "../../models/api/stardust/INftDetailsResponse";
import { INftOutputsRequest } from "../../models/api/stardust/INftOutputsRequest";
import { INftOutputsResponse } from "../../models/api/stardust/INftOutputsResponse";
import { IOutputDetailsResponse } from "../../models/api/stardust/IOutputDetailsResponse";
import { ISearchRequest } from "../../models/api/stardust/ISearchRequest";
import { ISearchResponse } from "../../models/api/stardust/ISearchResponse";
import { ITransactionDetailsRequest } from "../../models/api/stardust/ITransactionDetailsRequest";
import { ITransactionDetailsResponse } from "../../models/api/stardust/ITransactionDetailsResponse";
import { ITransactionHistoryRequest } from "../../models/api/stardust/ITransactionHistoryRequest";
import { ITransactionHistoryResponse } from "../../models/api/stardust/ITransactionHistoryResponse";
import { IStatsGetRequest } from "../../models/api/stats/IStatsGetRequest";
import { IStatsGetResponse } from "../../models/api/stats/IStatsGetResponse";
import { ApiClient } from "../apiClient";

/**
 * Class to handle api communications on stardust.
 */
export class StardustApiClient extends ApiClient {
    /**
     * Perform a request to get the base token info for a network.
     * @param request The Base token request.
     * @returns The response from the request.
     */
    public async baseTokenInfo(request: IBaseTokenGetRequest): Promise<IBaseTokenGetResponse> {
        return this.callApi<unknown, IBaseTokenGetResponse>(
            `token/${request.network}`,
            "get"
        );
    }

    /**
     * Find items from the tangle.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async search(request: ISearchRequest): Promise<ISearchResponse> {
        return this.callApi<unknown, ISearchResponse>(
            `stardust/search/${request.network}/${request.query}`,
            "get"
        );
    }

    /**
     * Get the block details.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async blockDetails(request: IBlockDetailsRequest): Promise<IBlockDetailsResponse> {
        return this.callApi<unknown, IBlockDetailsResponse>(
            `stardust/block/${request.network}/${request.blockId}`, "get"
        );
    }

    /**
     * Get the transaction included block.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async transactionIncludedBlockDetails(
        request: ITransactionDetailsRequest
    ): Promise<ITransactionDetailsResponse> {
        return this.callApi<unknown, ITransactionDetailsResponse>(
            `stardust/transaction/${request.network}/${request.transactionId}`, "get"
        );
    }

    /**
     * Get the output details.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async outputDetails(request: IOutputDetailsRequest): Promise<IOutputDetailsResponse> {
        return this.callApi<unknown, IOutputDetailsResponse>(
            `stardust/output/${request.network}/${request.outputId}`, "get"
        );
    }

    /**
     * Get the associated outputs.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async associatedOutputs(request: IAssociatedOutputsRequest) {
        return this.callApi<unknown, IAssociatedOutputsResponse>(
            `stardust/output/associated/${request.network}/${request.addressDetails.bech32}`,
            "post",
            { addressDetails: request.addressDetails }
        );
    }

    /**
     * Get the milestone details.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async milestoneDetails(request: IMilestoneDetailsRequest): Promise<IMilestoneDetailsResponse> {
        return this.callApi<unknown, IMilestoneDetailsResponse>(
            `stardust/milestone/${request.network}/${request.milestoneIndex}`,
            "get"
        );
    }

    /**
     * Get the transaction history of an address (chronicle).
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async transactionHistory(request: ITransactionHistoryRequest): Promise<ITransactionHistoryResponse> {
        const params = {
            pageSize: request.pageSize,
            sort: request.sort,
            startMilestoneIndex: request.startMilestoneIndex,
            cursor: request.cursor
        };

        return this.callApi<unknown, ITransactionHistoryResponse>(
            `stardust/transactionhistory/${request.network}/${request.address}${FetchHelper.urlParams(params)}`,
            "get"
        );
    }

    /**
     * Get the nfts of an address.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async nftOutputs(request: INftOutputsRequest): Promise<INftOutputsResponse> {
        return this.callApi<unknown, INftOutputsResponse>(
            `stardust/nfts/${request.network}/${request.address}`,
            "get"
        );
    }

    /**
     * Get the nft details by NFT address.
     * @param request The request to send.
     * @returns The response from the request.
     */
     public async nftAddressDetails(request: INftAddressDetailsRequest): Promise<INftAddressDetailsResponse> {
        return this.callApi<unknown, INftAddressDetailsResponse>(
            `stardust/nft-address/${request.network}/${request.nftId}`,
            "get"
        );
    }

    /**
     * Get the nft details (mock).
     * @param request The request to send.
     * @returns The response from the request.
     */
     public async nftDetails(request: INftDetailsRequest): Promise<INftDetailsResponse> {
        return this.callApi<unknown, INftDetailsResponse>(
            `stardust/nft/${request.network}/${request.nftId}`,
            "get"
        );
    }

    /**
     * Get the alias output details.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async aliasDetails(request: IAliasRequest): Promise<IAliasResponse> {
        return this.callApi<unknown, IAliasResponse>(
            `stardust/alias/${request.network}/${request.aliasId}`,
            "get"
        );
    }

    /**
     * Get the foundries controlled by an alias address.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async aliasFoundries(request: IFoundriesRequest): Promise<IFoundriesResponse> {
        return this.callApi<unknown, IFoundriesResponse>(
            `stardust/alias/foundries/${request.network}/${request.aliasAddress}`,
            "get"
        );
    }

    /**
     * Get the foundry output details.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async foundryDetails(request: IFoundryRequest): Promise<IFoundryResponse> {
        return this.callApi<unknown, IAliasResponse>(
            `stardust/foundry/${request.network}/${request.foundryId}`,
            "get"
        );
    }

    /**
     * Get the stats.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async stats(request: IStatsGetRequest): Promise<IStatsGetResponse> {
        return this.callApi<unknown, IStatsGetResponse>(
            `stats/${request.network}?includeHistory=${request.includeHistory ? "true" : "false"}`,
            "get"
        );
    }
}

