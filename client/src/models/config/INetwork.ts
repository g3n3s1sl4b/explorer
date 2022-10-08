import { NetworkType } from "./networkType";
import { ProtocolVersion } from "./protocolVersion";

/**
 * Definition of network configuration.
 */
export interface INetwork {
    /**
     * The network type.
     */
    network: NetworkType;

    /**
     * The protocol version.
     */
    protocolVersion: ProtocolVersion;

    /**
     * The label.
     */
    label: string;

    /**
     * The description for the network.
     */
    description?: string;

    /**
     * The provider to use for IOTA communication.
     */
    provider?: string;

    /**
     * The username for the endpoint.
     */
    user?: string;

    /**
     * The password for the endpoint.
     */
    password?: string;

    /**
     * Depth for attaches.
     */
    depth?: number;

    /**
     * Minimum weight magnitude for attaches.
     */
    mwm?: number;

    /**
     * The permanode endpoint.
     */
    permaNodeEndpoint?: string;

    /**
     * The permanode endpoint user.
     */
    permaNodeEndpointUser?: string;

    /**
     * The permanode endpoint password.
     */
    permaNodeEndpointPassword?: string;

    /**
     * The address of the coordinator.
     */
    coordinatorAddress?: string;

    /**
     * The level of the coordinator security.
     */
    coordinatorSecurityLevel?: number;

    /**
     * The bech32 human readable part prefix.
     */
    bechHrp?: string;

    /**
     * The primary color.
     */
    primaryColor?: string;

    /**
     * The secondary color.
     */
    secondaryColor?: string;

    /**
     * Is the network enabled.
     */
    isEnabled: boolean;

    /**
     * Is the network enabled.
     */
    isHidden?: boolean;

    /**
     * Show the market figures.
     */
    showMarket?: boolean;

    /**
     * An optional Example for a DID for the Identity tool
     */
    didExample?: string;

    /**
     * Url for faucet.
     */
    faucet?: string;

    /**
     * Native token circulating supply.
     */
    circulatingSupply?: number;

    /**
     * Targeted interval in seconds between milestones.
     */
    milestoneInterval?: number;

    /**
     * If Identity Resolver tool should be supported.
     */
    identityResolverEnabled?: boolean;
}
