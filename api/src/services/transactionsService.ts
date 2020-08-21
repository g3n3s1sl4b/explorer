import { asTransactionObject } from "@iota/transaction-converter";
import { ServiceFactory } from "../factories/serviceFactory";
import { IFeedSubscriptionMessage } from "../models/api/IFeedSubscriptionMessage";
import { ISn } from "../models/zmq/ISn";
import { ITxTrytes } from "../models/zmq/ITxTrytes";
import { ZmqService } from "./zmqService";

/**
 * Class to handle transactions service.
 */
export class TransactionsService {
    /**
     * The network configuration.
     */
    private readonly _networkId: string;

    /**
     * The zmq service.
     */
    private _zmqService: ZmqService;

    /**
     * The most recent transactions.
     */
    private _txValues: {
        [hash: string]: {
            trunk: string;
            branch: string;
            value: number;
        };
    };

    /**
     * The transaction tps history.
     */
    private _tps: {
        /**
         * Timestamp of count.
         */
        ts: number;
        /**
         * Transaction count.
         */
        tx: number;
        /**
         * Transaction count.
         */
        sn: number;
    }[];

    /**
     * The current total since last timestamp.
     */
    private _totalTxs: number;

    /**
     * Trytes subscription id.
     */
    private _trytesSubId: string;

    /**
     * The most recent confirmed transactions.
     */
    private _confirmedHashes: string[];

    /**
     * The current total confirmed since last timestamp.
     */
    private _totalConfirmed: number;

    /**
     * Confirmed subscription id.
     */
    private _confirmedSubId: string;

    /**
     * Timer id.
     */
    private _timerId?: NodeJS.Timer;

    /**
     * Timer counter.
     */
    private _timerCounter: number;

    /**
     * The callback for different events.
     */
    private readonly _subscribers: {
        [id: string]: (data: IFeedSubscriptionMessage) => Promise<void>;
    };

    /**
     * Create a new instance of TransactionsService.
     * @param networkId The network configuration.
     */
    constructor(networkId: string) {
        this._networkId = networkId;

        this._subscribers = {};
        this._timerCounter = 0;
    }

    /**
     * Initialise the service.
     */
    public async init(): Promise<void> {
        this._zmqService = ServiceFactory.get<ZmqService>(`zmq-${this._networkId}`);
        this._txValues = {};
        this._tps = [];
        this._totalTxs = 0;

        this._confirmedHashes = [];
        this._totalConfirmed = 0;

        this.startTimer();
        this.startZmq();
    }

    /**
     * Reset the service.
     */
    public reset(): void {
        this.stopTimer();
        this.stopZmq();

        this.startTimer();
        this.startZmq();
    }

    /**
     * Subscribe to transactions feed.
     * @param id The id of the subscriber.
     * @param callback The callback to call with data for the event.
     */
    public async subscribe(id: string, callback: (data: IFeedSubscriptionMessage) => Promise<void>): Promise<void> {
        this._subscribers[id] = callback;

        setTimeout(async () => {
            await this.updateSubscriptions(id);
        }, 0);
    }

    /**
     * Unsubscribe from the feed.
     * @param subscriptionId The id to unsubscribe.
     */
    public unsubscribe(subscriptionId: string): void {
        delete this._subscribers[subscriptionId];
    }

    /**
     * Start the zmq services.
     */
    private startZmq(): void {
        this.stopZmq();

        this._trytesSubId = this._zmqService.subscribe(
            "trytes", async (evnt: string, message: ITxTrytes) => {
                if (!this._txValues[message.hash]) {
                    this._totalTxs++;
                    const tx = asTransactionObject(message.trytes);
                    this._txValues[message.hash] = {
                        value: tx.value,
                        branch: tx.branchTransaction,
                        trunk: tx.trunkTransaction
                    };
                }
            });

        this._confirmedSubId = this._zmqService.subscribe(
            "sn", async (evnt: string, message: ISn) => {
                if (!this._confirmedHashes.includes(message.transaction)) {
                    this._totalConfirmed++;
                    this._confirmedHashes.push(message.transaction);
                }
            });
    }

    /**
     * Stop the zmq services.
     */
    private stopZmq(): void {
        this._totalTxs = 0;
        this._totalConfirmed = 0;

        if (this._trytesSubId) {
            this._zmqService.unsubscribe(this._trytesSubId);
            this._trytesSubId = undefined;
        }
        if (this._confirmedSubId) {
            this._zmqService.unsubscribe(this._confirmedSubId);
            this._confirmedSubId = undefined;
        }
    }

    /**
     * Start the timer for tps.
     */
    private startTimer(): void {
        this.stopTimer();
        this._timerId = setInterval(
            async () => {
                if (this._timerCounter++ % 50 === 0) {
                    this.handleTps();
                }
                await this.updateSubscriptions();
            },
            100);
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
     * @param singleSubscriberId Update an individual subscriber.
     */
    private async updateSubscriptions(singleSubscriberId?: string): Promise<void> {
        const now = Date.now();

        const tranCount = Object.keys(this._txValues).length;
        const snCount = this._confirmedHashes.length;

        if (tranCount > 0 || snCount > 0 || singleSubscriberId) {
            let subs: {
                [id: string]: (data: IFeedSubscriptionMessage) => Promise<void>;
            };

            if (singleSubscriberId) {
                subs = {};
                subs[singleSubscriberId] = this._subscribers[singleSubscriberId];
            } else {
                subs = this._subscribers;
            }

            for (const subscriptionId in subs) {
                const data: IFeedSubscriptionMessage = {
                    subscriptionId,
                    transactions: this._txValues,
                    confirmed: this._confirmedHashes,
                    tps: {
                        start: this._tps.length > 0 ? this._tps[this._tps.length - 1].ts : now,
                        end: this._tps.length > 0 ? this._tps[0].ts : now,
                        tx: this._tps.map(t => t.tx),
                        sn: this._tps.map(t => t.sn)
                    }
                };

                await subs[subscriptionId](data);
            }

            if (!singleSubscriberId) {
                this._txValues = {};
                this._confirmedHashes = [];
            }
        }
    }

    /**
     * Handle the transactions per second calculations.
     */
    private handleTps(): void {
        const lastTxTotal = this._totalTxs;
        const lastConfirmedTotal = this._totalConfirmed;
        this._totalTxs = 0;
        this._totalConfirmed = 0;
        this._tps.unshift({
            tx: lastTxTotal,
            sn: lastConfirmedTotal,
            ts: Date.now()
        });
        this._tps = this._tps.slice(0, 100);
    }
}
