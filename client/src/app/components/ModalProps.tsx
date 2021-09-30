// eslint-disable-next-line no-shadow
export enum ModalIconType {
    Dots = "dots",
    Info = "info"
}

export interface ModalProps {
    /**
     * The clickable icon path to show the modal.
     */
    icon: ModalIconType;
    /**
     * The title and description of Modal.
     */
    data: {
        title?: string;
        description: string;
    };
}
