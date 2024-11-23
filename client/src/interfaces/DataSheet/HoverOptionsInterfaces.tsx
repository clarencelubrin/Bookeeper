export interface HoverOptionsProps {
    absolute_position?: string;
    is_hovered: boolean;
    row_index: number;
    addRow: (row_index: number) => void;
    is_checked: boolean;
    setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}