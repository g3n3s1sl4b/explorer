import classNames from "classnames";
import moment from "moment";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DateHelper } from "../../../../helpers/dateHelper";
import { formatAmount } from "../../../../helpers/stardust/valueFormatHelper";
import NetworkContext from "../../../context/NetworkContext";
import { ITransactionEntryProps } from "./TransactionEntryProps";

const TransactionRow: React.FC<ITransactionEntryProps> = (
    { outputId, transactionId, date, value, isSpent, isFormattedAmounts, setIsFormattedAmounts, darkBackgroundRow }
) => {
    const { name: network, tokenInfo } = useContext(NetworkContext);
    const outputIdTransactionShort = `${outputId.slice(0, 11)}....${outputId.slice(-11, -4)}`;
    const outputIdIndex = outputId.slice(-4);
    const transactionIdShort = `${transactionId.slice(0, 11)}....${transactionId.slice(-11)}`;
    const ago = moment(date * 1000).fromNow();

    const valueView = (
        <span className="pointer margin-r-5" onClick={() => setIsFormattedAmounts(!isFormattedAmounts)} >
            {`${isSpent ? "-" : "+"} ${formatAmount(value, tokenInfo, !isFormattedAmounts)}`}
        </span>
    );

    return (
        <tr className={darkBackgroundRow ? "dark" : ""}>
            <td className="transaction-id">
                <Link to={`/${network}/transaction/${transactionId}`} className="margin-r-t">
                    {transactionIdShort}
                </Link>
            </td>
            <td className="output-id">
                <Link to={`/${network}/output/${outputId}`} className="margin-r-t">
                    <span>{outputIdTransactionShort}</span> <span className="highlight">{outputIdIndex}</span>
                </Link>
            </td>
            <td className="date">{`${DateHelper.formatShort(date * 1000)} (${ago})`}</td>
            <td className={classNames("amount", { "negative": isSpent })}>{valueView}</td>
        </tr>
    );
};

export default TransactionRow;
