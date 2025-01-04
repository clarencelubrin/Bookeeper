export interface SidebarProps {
    className: string;
    currentSheet: string;
<<<<<<< HEAD
    style?: React.CSSProperties;
    setCurrentSheet: (sheet: string) => void;
}
export interface SidebarBodyProps extends SidebarProps {
    isOpen: boolean;
}
export interface LinkItemProps {
    onclick: () => void;
=======
    setCurrentSheet: (sheet: string) => void;
}
export interface LinkItemProps {
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
    link: string;
    children: string;
    currentFile: string;
}
export interface LinkButtonProps {
    onClick: () => void;
    currentSheet: string;
    children: string;
}