/**
 * Listeners required for dragging
 */
export type DragListeners = {
    dragStart: (event: any) => void;
    drag: (event: any) => void;
    dragEnd: (event: any) => void;
}