import { ServiceFactory } from "../../../factories/serviceFactory";
import { ITransactionHistoryRequest } from "../../../models/api/chrysalis/ITransactionHistoryRequest";
import { ITransactionHistoryResponse } from "../../../models/api/chrysalis/ITransactionHistoryResponse";
import { IConfiguration } from "../../../models/configuration/IConfiguration";
import { CHRYSALIS } from "../../../models/db/protocolVersion";
import { NetworkService } from "../../../services/networkService";
import { ChrysalisTangleHelper } from "../../../utils/chrysalis/chrysalisTangleHelper";
import { ValidationHelper } from "../../../utils/validationHelper";

/**
 * Find the object from the network.
 * @param config The configuration.
 * @param request The request.
 * @returns The response.
 */
export async function get(
    config: IConfiguration,
    request: ITransactionHistoryRequest
): Promise<ITransactionHistoryResponse> {
    const networkService = ServiceFactory.get<NetworkService>("network");
    const networks = networkService.networkNames();
    ValidationHelper.oneOf(request.network, networks, "network");

    const networkConfig = networkService.get(request.network);

    if (networkConfig.protocolVersion !== CHRYSALIS) {
        return {};
    }

    const transactionHistory = await ChrysalisTangleHelper.transactionHistory(networkConfig, request);

    return transactionHistory;
}
