export interface FunctionContextType {
    updateCell: (rowIndex: number, key: string, value: string) => void;
    addRow: (row_index: number) => void;
    deleteRow: () => void;
    addDataTable: (sheet: string, table_index: number) => () => void;
    updateDictCell: (rowIndex: number, columnIndex: number, value: string) => void;
    addDictRow: (row_index: number) => void;
    setCheckedRows: React.Dispatch<React.SetStateAction<number[]>>;
    setSheetWidths: React.Dispatch<React.SetStateAction<number[]>>;
    inputsRef: React.MutableRefObject<Object>;
    focusInput: (row_index: number, cell_index: number) => void;
}

export interface PropContextType {
    table_data: any;
    sheet: string;
    table_index: number;
    sheet_widths: number[];
    checked_rows: number[];
}
export interface TableProviderProps {
    table_data: any;
    sheet: string;
    table_index: number;
    sheet_widths: number[];
    setSheetWidths: React.Dispatch<React.SetStateAction<number[]>>;
    children: React.ReactNode;
}

export const defaultFunctionContext: FunctionContextType = {
    updateCell: () => {},
    addRow: () => {},
    deleteRow: () => {},
    addDataTable: () => () => {},
    updateDictCell: () => {},
    addDictRow: () => {},
    setCheckedRows: () => [],
    setSheetWidths: () => [],
    inputsRef: {current: {}},
    focusInput: () => {},
};

export const defaultPropContext: PropContextType = {
    table_data: {},
    sheet: '',
    table_index: 0,
    sheet_widths: [],
    checked_rows: [],
};