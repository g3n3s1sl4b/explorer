import { HexHelper } from "@iota/util.js-stardust";
import { useEffect, useState } from "react";
import { ServiceFactory } from "../../factories/serviceFactory";
import { STARDUST } from "../../models/config/protocolVersion";
import { StardustTangleCacheService } from "../../services/stardust/stardustTangleCacheService";

/**
 * Fetch the milestone referenced blocks
 * @param network The Network in context
 * @param milestoneId The milestone id
 * @returns The blocks and loading bool.
 */
export function useMilestoneReferencedBlocks(network: string, milestoneId: string | null):
    [
        string[] | null,
        boolean,
        string?
    ] {
    const [tangleCacheService] = useState(
        ServiceFactory.get<StardustTangleCacheService>(`tangle-cache-${STARDUST}`)
    );
    const [milestoneReferencedBlocks, setMilestoneReferencedBlocks] = useState<string[] | null>(null);
    const [error, setError] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        if (milestoneId) {
            // eslint-disable-next-line no-void
            void (async () => {
                tangleCacheService.milestoneReferencedBlocks(
                    network,
                    HexHelper.addPrefix(milestoneId)
                ).then(response => {
                    setMilestoneReferencedBlocks(response.blocks ?? null);
                    setError(response.error);
                }).finally(() => {
                    setIsLoading(false);
                });
            })();
        } else {
            setIsLoading(false);
        }
    }, [network, milestoneId]);

    return [milestoneReferencedBlocks, isLoading, error];
}
