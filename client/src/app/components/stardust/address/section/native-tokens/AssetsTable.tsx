import {
    ALIAS_OUTPUT_TYPE, BASIC_OUTPUT_TYPE,
    FOUNDRY_OUTPUT_TYPE, IOutputResponse, NFT_OUTPUT_TYPE
} from "@iota/iota.js-stardust";
import React, { useEffect, useState } from "react";
import { IToken } from "../../../../../../models/api/stardust/foundry/IToken";
import Pagination from "../../../../Pagination";
import Asset from "./Asset";
import "./AssetsTable.scss";

interface AssetsTableProps {
    networkId: string;
    outputs: IOutputResponse[] | null;
    setTokenCount?: (count: number) => void;
}

const TOKEN_PAGE_SIZE: number = 10;

const AssetsTable: React.FC<AssetsTableProps> = ({ networkId, outputs, setTokenCount }) => {
    const [tokens, setTokens] = useState<IToken[]>();
    const [currentPage, setCurrentPage] = useState<IToken[]>([]);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        if (setTokenCount) {
            setTokenCount(0);
        }

        if (outputs) {
            const theTokens: IToken[] = [];
            for (const outputResponse of outputs) {
                const output = outputResponse.output;
                if (output.type === BASIC_OUTPUT_TYPE || output.type === ALIAS_OUTPUT_TYPE ||
                    output.type === FOUNDRY_OUTPUT_TYPE || output.type === NFT_OUTPUT_TYPE) {
                    for (const token of output.nativeTokens ?? []) {
                        const existingToken = theTokens.find(t => t.id === token.id);
                        if (existingToken) {
                            existingToken.amount += Number(token.amount);
                        } else {
                            theTokens.push({ id: token.id, amount: Number.parseInt(token.amount, 16) });
                        }
                    }
                }
            }

            setTokens(theTokens);
            if (setTokenCount) {
                setTokenCount(theTokens.length);
            }
        }
    }, [outputs]);

    useEffect(() => {
        const from = (pageNumber - 1) * TOKEN_PAGE_SIZE;
        const to = from + TOKEN_PAGE_SIZE;
        if (tokens) {
            setCurrentPage(tokens.slice(from, to));
        }
    }, [tokens, pageNumber]);

    return (
        tokens && tokens?.length > 0 ? (
            <div className="section">
                <table className="asset-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Token id</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPage.map((token, k) => (
                            <React.Fragment key={`${token.id}${k}`}>
                                <Asset
                                    key={k}
                                    token={token}
                                    network={networkId}
                                    tableFormat={true}
                                />
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                {/* Only visible in mobile -- Card assets*/}
                <div className="asset-cards">
                    {currentPage.map((token, k) => (
                        <React.Fragment key={`${token.id}${k}`}>
                            <Asset
                                key={k}
                                token={token}
                                network={networkId}
                            />
                        </React.Fragment>
                    ))}
                </div>
                <Pagination
                    currentPage={pageNumber}
                    totalCount={tokens?.length ?? 0}
                    pageSize={TOKEN_PAGE_SIZE}
                    siblingsCount={1}
                    onPageChange={number => setPageNumber(number)}
                />
            </div>
        ) : null
    );
};

AssetsTable.defaultProps = {
    setTokenCount: undefined
};

export default AssetsTable;