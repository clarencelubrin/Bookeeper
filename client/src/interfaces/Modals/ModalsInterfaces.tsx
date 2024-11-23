export interface ModalProps {
    showModal: boolean;
    modalType: string;
    onClickBackdrop: () => void;
}

export interface BackdropProps {
    children: React.ReactNode;
    onClickBackdrop: () => void;
}
  