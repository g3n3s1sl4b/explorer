import { HexEncodedString } from "@iota/iota.js-stardust";
import { HexHelper } from "@iota/util.js-stardust";
import { useEffect, useState } from "react";
import { ServiceFactory } from "../../factories/serviceFactory";
import { STARDUST } from "../../models/config/protocolVersion";
import { StardustTangleCacheService } from "../../services/stardust/stardustTangleCacheService";

/**
 * Fetch block children
 * @param network The Network in context
 * @param blockId The block id
 * @returns The output response and loading bool.
 */
export function useBlockChildren(network: string, blockId: string | null):
    [
        HexEncodedString[] | null,
        boolean
    ] {
    const [tangleCacheService] = useState(
        ServiceFactory.get<StardustTangleCacheService>(`tangle-cache-${STARDUST}`)
    );
    const [blockChildren, setBlockChildren] = useState<HexEncodedString[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        setBlockChildren(null);
        if (blockId) {
            // eslint-disable-next-line no-void
            void (async () => {
                tangleCacheService.blockChildren(
                    network,
                    HexHelper.addPrefix(blockId)
                ).then(response => {
                    if (!response?.error) {
                        setBlockChildren(response.children ?? null);
                    }
                }).finally(() => {
                    setIsLoading(false);
                });
            })();
        } else {
            setIsLoading(false);
        }
    }, [network, blockId]);

    return [blockChildren, isLoading];
}