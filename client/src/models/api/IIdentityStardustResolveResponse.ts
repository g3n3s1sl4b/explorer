import { IResponse } from "./IResponse";

export interface IIdentityStardustResolveResponse extends IResponse {
    /**
     * The resolved DID Document.
     */
    document?: {
        doc: unknown;
        meta: {
            governorAddress: string;
            stateControllerAddress: string;
        };
    };

    /**
     * Governor of Alias Output.
     */
    governorAddress?: string;

    /**
     * State controller of Alias Output.
     */
    stateControllerAddress?: string;
}
