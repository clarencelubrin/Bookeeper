export type ResizerProps = {
    setSheetWidths: React.Dispatch<React.SetStateAction<number[]>>;
    thIndex: number;
};
export interface ResizeClickEvent extends React.MouseEvent<HTMLDivElement> {
    target: HTMLDivElement & EventTarget;
}