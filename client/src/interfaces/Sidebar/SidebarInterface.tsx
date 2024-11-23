export interface SidebarProps {
    className: string;
    currentSheet: string;
    setCurrentSheet: (sheet: string) => void;
}
export interface LinkItemProps {
    link: string;
    children: string;
    currentFile: string;
}
export interface LinkButtonProps {
    onClick: () => void;
    currentSheet: string;
    children: string;
}