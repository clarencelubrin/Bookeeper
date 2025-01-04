export interface TableDictCellProps {
    cell: any;
    row_index: number;
    cell_index: number;
    children: React.ReactNode;
    inputClass?: string;
    tdClass?: string;
}
export interface RowDictCellProps {
    cell: any;
    row_index: number;
    cell_index: number;
    is_hover: boolean;
    is_checked: boolean;
    setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
    inputClass?: string;
    tdClass?: string;
}