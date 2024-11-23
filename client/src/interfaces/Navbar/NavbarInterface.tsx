export interface NavbarProps {
    show_navlink?: boolean;
    show_titletexbox?: boolean;
    show_dropdown?: boolean;
}
export interface DropdownMenuProps {
    is_open: boolean;
}
export interface DropdownMenuItemProps {
    name: string;
    icon: JSX.Element;
    onClick?: () => void;
}