import "./IdentityJsonCompare.scss";
import React, { Component, ReactNode } from "react";
import ReactDiffViewer from "react-diff-viewer";
import { HiDownload } from "react-icons/hi";
import { DownloadHelper } from "../../../helpers/downloadHelper";
import { JsonSyntaxHelper } from "../../../helpers/jsonSyntaxHelper";
import { DiffMessage } from "../../../models/api/IIdentityDiffHistoryResponse";
import IdentityCompareDropdown from "./IdentityCompareDropdown";
import { IdentityJsonCompareProps } from "./IdentityJsonCompareProps";
import IdentityMessageIdOverview from "./IdentityMsgIdOverview";

const COMPARE_ICON = (
    <svg
        className="compare-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="5" y="5" width="10" height="10" rx="2" stroke="#BDBDBD" strokeWidth="2" />
        <rect x="9" y="9" width="10" height="10" rx="2" stroke="#BDBDBD" strokeWidth="2" />
        <path
            // eslint-disable-next-line max-len
            d="M15.9999 8V13.9999C15.9999 15.1044 15.1044 15.9999 13.9999 15.9999H8V10C8 8.89543 8.89543 8 10 8H15.9999Z"
            fill="#BDBDBD"
        />
    </svg>
);

class IdentityJsonCompare extends Component<IdentityJsonCompareProps> {
    public render(): ReactNode {
        return (
            <div>
                {/* --------- Header of JsonViewer --------- */}
                <div className="identity-json-header">
                    <div className="compare-elements">
                        <IdentityMessageIdOverview
                            status={(this.props.content as DiffMessage).diff ? "diff" : "integration"}
                            messageId={this.props.messageId}
                            onClick={() => {
                                window.location.href = `/${this.props.network}/message/${this.props.messageId}`;
                            }}
                        />
                        {!(this.props.content as DiffMessage).diff && (
                            <div className="row">
                                {COMPARE_ICON}
                                <IdentityCompareDropdown
                                    messages={this.props.compareWith ?? []}
                                    selectedMessageId={this.props.selectedComparedMessageId}
                                    onSelectionChange={(messageId, content) => {
                                        this.props.onCompareSelectionChange(messageId, content);
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <a
                        href={DownloadHelper.createJsonDataUrl(this.props.content)}
                        download={DownloadHelper.filename(this.props.messageId, "json")}
                        role="button"
                    >
                        <HiDownload />
                    </a>
                </div>

                {/* --------- Json Compare Viewer --------- */}
                <div
                    className="
                    card--value
                    card--value-textarea
                    card--value-textarea__json"
                >
                    <ReactDiffViewer
                        newValue={JSON.stringify(this.props.content, null, 4)}
                        oldValue={
                            this.props.selectedComparedContent
                                ? JSON.stringify(this.props.selectedComparedContent, null, 4)
                                : JSON.stringify(this.props.content, null, 4)
                        }
                        splitView={false}
                        disableWordDiff={true}
                        renderContent={this.highlightSyntax}
                        hideLineNumbers={true}
                        showDiffOnly={false}
                        styles={{
                            variables: {
                                light: {
                                    diffViewerBackground: "#f2f5fb"
                                }
                            }
                        }}
                    />
                </div>
            </div>
        );
    }

    private readonly highlightSyntax = (str: string): JSX.Element => (
        <span
            className="json-viewer"
            dangerouslySetInnerHTML={{
                __html: JsonSyntaxHelper.syntaxHighlight(str)
            }}
        />
    );
}

export default IdentityJsonCompare;