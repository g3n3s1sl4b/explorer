import { IBlockMetadata } from "@iota/iota.js-stardust";
import type { IMqttClient } from "@iota/mqtt.js-stardust";
import { Converter } from "@iota/util.js-stardust";
import { ServiceFactory } from "../../factories/serviceFactory";
import { IFeedItemMetadata } from "../../models/api/stardust/IFeedItemMetadata";
import { IFeedSubscriptionItem } from "../../models/api/stardust/IFeedSubscriptionItem";
import { IFeedService } from "../../models/services/IFeedService";
import { IItemsService } from "../../models/services/stardust/IItemsService";

/**
 * Service to handle blocks on stardust.
 */
export class StardustItemsService implements IItemsService {
    /**
     * The network configuration.
     */
    protected readonly _networkId: string;

    /**
     * The mqtt client.
     */
    private _mqttClient: IMqttClient;

    /**
     * Feed service.
     */
    private _feedService: IFeedService;

    /**
     * Item subscription id.
     */
    private _itemSubscriptionId: string;

    /**
     * Metadata subscription id.
     */
    private _metadataSubscriptionId: string;

    /**
     * Milestone subscription id.
     */
    private _milestoneSubscriptionId: string;

    /**
     * The callback for different events.
     */
    private readonly _subscribers: {
        [id: string]: (data: IFeedSubscriptionItem) => Promise<void>;
    };

    /**
     * The most recent items.
     */
    private _items: string[];

    /**
     * The most recent item metadata.
     */
    private _itemMetadata: { [id: string]: IFeedItemMetadata };

    /**
     * Timer id.
     */
    private _timerId?: NodeJS.Timer;

    /**
     * Create a new instance of StardustItemsService.
     * @param networkId The network configuration.
     */
    constructor(networkId: string) {
        this._subscribers = {};
        this._networkId = networkId;
    }

    /**
     * Initialise the service.
     */
    public init(): void {
        this._items = [];
        this._itemMetadata = {};

        this._mqttClient = ServiceFactory.get<IMqttClient>(`mqtt-${this._networkId}`);
        this._feedService = ServiceFactory.get<IFeedService>(`feed-${this._networkId}`);

        this.startSubscription();

        this.startTimer();
    }

    /**
     * Reset the service.
     */
    public reset(): void {
        this.stopTimer();
        this.stopSubscription();

        this.startTimer();
        this.startSubscription();
    }

    /**
     * Subscribe to transactions feed.
     * @param id The id of the subscriber.
     * @param callback The callback to call with data for the event.
     */
    public async subscribe(id: string, callback: (data: IFeedSubscriptionItem) => Promise<void>): Promise<void> {
        this._subscribers[id] = callback;
    }

    /**
     * Unsubscribe from the feed.
     * @param subscriptionId The id to unsubscribe.
     */
    public unsubscribe(subscriptionId: string): void {
        delete this._subscribers[subscriptionId];
    }

    /**
     * Start the timer for tps.
     */
    private startTimer(): void {
        this.stopTimer();
        this._timerId = setTimeout(
            async () => {
                await this.updateSubscriptions();
            },
            500);
    }

    /**
     * Stop the timer for tps.
     */
    private stopTimer(): void {
        if (this._timerId) {
            clearInterval(this._timerId);
            this._timerId = undefined;
        }
    }

    /**
     * Update the subscriptions with newest trytes.
     */
    private async updateSubscriptions(): Promise<void> {
        if (this._items.length > 0 ||
            Object.keys(this._itemMetadata).length > 0) {
            for (const subscriptionId in this._subscribers) {
                const data: IFeedSubscriptionItem = {
                    subscriptionId,
                    items: this._items,
                    itemsMetadata: this._itemMetadata
                };

                try {
                    await this._subscribers[subscriptionId](data);
                } catch { }
            }

            this._items = [];
            this._itemMetadata = {};
        }

        this.startTimer();
    }


    /**
     * Start the subscriptions.
     */
    private startSubscription(): void {
        this.stopSubscription();

        this._itemSubscriptionId = this._mqttClient.blocksRaw(
            (topic: string, block: Uint8Array) => {
                this._items.push(Converter.bytesToHex(block));
            });

        this._metadataSubscriptionId = this._mqttClient.blocksReferenced(
            (topic: string, metadata: IBlockMetadata) => {
                this._itemMetadata[metadata.blockId] = {
                    milestone: metadata.milestoneIndex,
                    referenced: metadata.referencedByMilestoneIndex,
                    solid: metadata.isSolid,
                    conflicting: metadata.ledgerInclusionState === "conflicting",
                    conflictReason: metadata.conflictReason,
                    included: metadata.ledgerInclusionState === "included",
                    ...this._itemMetadata[metadata.blockId]
                };
            });

        this._milestoneSubscriptionId = this._feedService.subscribeMilestones(
            (milestone: number, id: string, timestamp: number) => {
                this._itemMetadata[id] = {
                    milestone,
                    timestamp,
                    ...this._itemMetadata[id]
                };
            });
    }

    /**
     * Stop the subscriptions.
     */
    private stopSubscription(): void {
        if (this._itemSubscriptionId) {
            this._mqttClient.unsubscribe(this._itemSubscriptionId);
            this._itemSubscriptionId = undefined;
        }
        if (this._metadataSubscriptionId) {
            this._mqttClient.unsubscribe(this._metadataSubscriptionId);
            this._metadataSubscriptionId = undefined;
        }
        if (this._milestoneSubscriptionId) {
            this._feedService.unsubscribe(this._milestoneSubscriptionId);
            this._milestoneSubscriptionId = undefined;
        }
    }
}