import { IOutputsResponse } from "@iota/iota.js-stardust";
import { IResponse } from "../IResponse";

export interface IFoundryOutputsResponse extends IResponse {
    /**
     * The output ids response.
     */
    foundryOutputsResponse?: IOutputsResponse;
}
