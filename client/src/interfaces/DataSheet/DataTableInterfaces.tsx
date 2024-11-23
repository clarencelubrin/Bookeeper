export interface DataTableRowProps {
    row_data_values: string[][];
    row_style: string[];
    row_index: number;
}
export interface DataTableCellProps {
    value: string;
    column: string;
    style: string;
    row_index: number;
    cell_index: number;
    is_hover: boolean;
    is_checked: boolean;
    setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface HandleKeyDownProps {
    key: string;
}