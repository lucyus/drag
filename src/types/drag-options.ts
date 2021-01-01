import { Position } from '../internal/position';

/**
 * Drag options for the `Drag` class
 */
export type DragOptions = {
    initialPosition?: Position | undefined;
    handle?: HTMLElement | undefined;
    isDraggable?: boolean | undefined;
    boundary?: HTMLElement | undefined;
}
