export interface ModalProps {
    showModal: boolean;
    modalType: string;
    onClickBackdrop: () => void;
<<<<<<< HEAD
    modalRef: React.RefObject<HTMLDivElement>;
}

export interface BackdropProps {
    children?: React.ReactNode;
    onClickBackdrop: () => void;
    modalRef: React.RefObject<HTMLDivElement>;
=======
}

export interface BackdropProps {
    children: React.ReactNode;
    onClickBackdrop: () => void;
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
}
  