export interface NavbarProps {
    show_navlink?: boolean;
    show_titletexbox?: boolean;
    show_dropdown?: boolean;
}
export interface DropdownMenuProps {
    is_open: boolean;
<<<<<<< HEAD
    modalRef: React.RefObject<HTMLDivElement>;
=======
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
}
export interface DropdownMenuItemProps {
    name: string;
    icon: JSX.Element;
    onClick?: () => void;
}