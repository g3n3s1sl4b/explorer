import { OutputTypes } from "@iota/iota.js-stardust";

export interface OutputProps {
    /**
     * The output id.
     */
    outputId: string;

    /**
     * The output to display.
     */
    output: OutputTypes;

    /**
     * The amount to display.
     */
    amount: number;

    /**
     * Show amount and copy button.
     */
    showCopyAmount: boolean;

    /**
     * Should the output be pre-expanded.
     */
    isPreExpanded?: boolean;

    /**
     * Should the outputId be displayed in full (default truncated).
     */
    displayFullOutputId?: boolean;

    /**
     * The network to lookup.
     */
    network: string;

    /**
     * Disable links if block is conflicting.
     */
     isLinksDisabled?: boolean;
}