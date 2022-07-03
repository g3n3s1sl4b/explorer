/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/require-returns */
import { IOutputResponse } from "@iota/iota.js-stardust";
import React, { useCallback, useEffect, useState } from "react";
import transactionHistoryMessage from "../../../../assets/modals/address/transaction-history.json";
import { ServiceFactory } from "../../../../factories/serviceFactory";
import { ITransactionHistoryRequest } from "../../../../models/api/stardust/ITransactionHistoryRequest";
import { ITransactionHistoryItem, ITransactionHistoryResponse } from "../../../../models/api/stardust/ITransactionHistoryResponse";
import { STARDUST } from "../../../../models/config/protocolVersion";
import { StardustTangleCacheService } from "../../../../services/stardust/stardustTangleCacheService";
import Modal from "../../../components/Modal";
import Pagination from "../../../components/Pagination";
import Spinner from "../../Spinner";
import TransactionCard from "./TransactionCard";
import TransactionRow from "./TransactionRow";
import "./TransactionHistory.scss";

interface TransactionHistoryProps {
    network: string;
    address: string;
}

interface IOutputDetailsMap {
    [outputId: string]: IOutputResponse;
}

const PAGE_SIZE: number = 10;

/**
 * Component which will display transaction history.
 */
const TransactionHistory: React.FC<TransactionHistoryProps> = ({ network, address }) => {
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
    const [history, setHistory] = useState<ITransactionHistoryItem[]>([]);
    const [historyPage, setHistoryPage] = useState<ITransactionHistoryItem[]>([]);
    const [outputDetailsMap, setOutputDetailsMap] = useState<IOutputDetailsMap>({});
    const [cursor, setCursor] = useState<string | undefined>();
    const [isFormattedAmounts, setIsFormattedAmounts] = useState(true);

    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [allOutputDetailsLoaded, setAllOutputDetailsLoaded] = useState(false);

    const tangleService = useCallback(
        () => ServiceFactory.get<StardustTangleCacheService>(`tangle-cache-${STARDUST}`),
        [network, address]
    );

    useEffect(() => {
        loadHistory();
        setHistoryPage(history);
    }, [network, address]);

    const loadHistory = () => {
        const request: ITransactionHistoryRequest = {
            network,
            address,
            pageSize: PAGE_SIZE,
            sort: "desc",
            cursor
        };

        tangleService().transactionHistory(request)
            .then((response: ITransactionHistoryResponse | undefined) => {
                if (response?.items) {
                    setHistory([...history, ...response.items]);
                    setCursor(response.cursor);
                }
            })
            .catch(e => console.log(e));
    };

    useEffect(() => {
        if (history.length > 0 && !allOutputDetailsLoaded) {
            const promises: Promise<void>[] = [];
            const detailsPage: IOutputDetailsMap = {};

            const fetchDetails = async () => {
                for (const item of history) {
                    const promise = tangleService().outputDetails(network, item.outputId)
                        .then(detailsResponse => {
                            if (detailsResponse) {
                                detailsPage[item.outputId] = detailsResponse;
                            }
                        })
                        .catch(e => console.log(e));

                    promises.push(promise);
                }

                await Promise.all(promises);

                setOutputDetailsMap(detailsPage);
                setAllOutputDetailsLoaded(true);
                setIsLoading(false);
                setTotalCount(history.length);
            };

            /* eslint-disable @typescript-eslint/no-floating-promises */
            fetchDetails();
        }
    }, [history]);

    useEffect(() => {
        const from = (currentPageNumber - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;
        const page = history?.slice(from, to);

        setHistoryPage(page);
    }, [currentPageNumber, history]);

    const loadMoreHandler = () => {
        setAllOutputDetailsLoaded(false);
        setIsLoading(true);
        loadHistory();
    };

    return (totalCount > 0 ? (
        <div className="section transaction-history--section">
            <div className="section--header row space-between">
                <div className="row middle">
                    <h2>
                        Transaction History
                    </h2>
                    <Modal icon="info" data={transactionHistoryMessage} />
                </div>
                <div className="margin-t-s middle row">
                    {isLoading && <Spinner />}
                </div>
            </div>
            <table className="transaction-history--table">
                <thead>
                    <tr>
                        <th>Block Id</th>
                        <th>Date</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {historyPage.length > 0 && (
                        historyPage.map((historyItem, idx) => {
                            const outputDetails = outputDetailsMap[historyItem.outputId];

                            return outputDetails ? (
                                <React.Fragment key={idx}>
                                    <TransactionRow
                                        blockId={outputDetails.metadata.blockId}
                                        date={historyItem.milestoneTimestamp}
                                        value={Number(outputDetails.output.amount)}
                                        isSpent={historyItem.isSpent}
                                        isFormattedAmounts={isFormattedAmounts}
                                        setIsFormattedAmounts={setIsFormattedAmounts}
                                    />
                                </React.Fragment>) : null;
                        })
                    )}
                </tbody>
            </table>

            {/* Only visible in mobile -- Card transactions*/}
            <div className="transaction-history--cards">
                {historyPage.length > 0 && (
                    historyPage.map((historyItem, idx) => {
                        const outputDetails = outputDetailsMap[historyItem.outputId];

                        return outputDetails ? (
                            <React.Fragment key={idx}>
                                <TransactionCard
                                    blockId={outputDetails.metadata.blockId}
                                    date={historyItem.milestoneTimestamp}
                                    value={Number(outputDetails.output.amount)}
                                    isSpent={historyItem.isSpent}
                                    isFormattedAmounts={isFormattedAmounts}
                                    setIsFormattedAmounts={setIsFormattedAmounts}
                                />
                            </React.Fragment>) : null;
                    })
                )}
            </div>
            <Pagination
                currentPage={currentPageNumber}
                totalCount={totalCount}
                pageSize={PAGE_SIZE}
                siblingsCount={1}
                onPageChange={setCurrentPageNumber}
            />
            {cursor && totalCount > 0 && (
                <div className="card load-more--button" onClick={loadMoreHandler}>
                    <button type="button">Load more...</button>
                </div>
            )}
        </div>) : null
    );
};

export default TransactionHistory;

