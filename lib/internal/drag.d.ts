import { Position } from './position';
import { DragOptions } from '../types/drag-options';
import { DragListeners } from '../types/drag-listeners';
/**
 * Drag makes DOM HTML elements draggable
*/
export declare class Drag {
    /**
     * @protected Relative position of the draggable element currently
     */
    protected _currentPosition: Position;
    /**
     * @protected Relative position of the draggable element when drag starts
     */
    protected _startPosition: Position;
    /**
     * @protected The drag HTML element
     */
    protected _htmlElement: HTMLElement;
    /**
     * @protected The handle HTML element
     */
    protected _handle: HTMLElement;
    /**
     * @protected The boundary HTML element
     */
    protected _boundary: HTMLElement | null | undefined;
    /**
     * @protected Current draggability state
     */
    protected _isDraggable: boolean;
    /**
     * @protected List of the required mouse
     * listeners for dragging
     */
    protected _mouseListeners: DragListeners;
    /**
     * @protected List of the required touch
     * listeners for dragging
     */
    protected _touchListeners: DragListeners;
    /**
     * Relative position of the draggable
     * element currently
     *
     * @returns Current drag `Position`
     */
    get currentPosition(): Position;
    /**
     * Sets the relative position of the
     * draggable element and update the view
     */
    set currentPosition(position: Position);
    /**
     * Boundary state of the draggable element
     *
     * @returns `true` if a boundary is set, `false`
     * otherwise
     */
    get hasBoundaries(): boolean;
    /**
     * Checks if the draggable element is within the
     * boundaries
     *
     * @returns `true` if the draggable element is
     * within the boundaries, `false` otherwise
     */
    get isInBounds(): boolean;
    /**
     * Drag constructor
     *
     * @param htmlElement DOM HTML element intended to be draggable
     * @param dragOptions Optional drag settings. They can also be
     * set after initialization
     */
    constructor(htmlElement: HTMLElement, dragOptions?: DragOptions | undefined);
    /**
     * Enables draggability of the drag element
     */
    enable(): void;
    /**
     * Disables draggability of the drag element
     */
    disable(): void;
    /**
     * Toggle draggability of the drag element
     */
    toggleDraggable(): void;
    /**
     * Sets the position of the drag element
     * @param position New position of the drag element
     */
    setPosition(position: Position): void;
    /**
     * Set a handle for the drag element
     * @param handle DOM HTML element used for dragging
     */
    setHandle(handle: HTMLElement): void;
    /**
     * Remove the set handle and set
     * the whole drag element as the
     * default handle
     */
    removeHandle(): void;
    /**
     * Sets the boundaries of the draggable element
     * @param boundary HTML DOM boundary element of the
     * draggable element
     */
    setBoundary(boundary: HTMLElement | null): void;
    /**
     * Removes the boundaries of the draggable element
     */
    removeBoundary(): void;
    /**
     * Checks if the draggable element is within
     * the boundary
     * @param position Position of the drag element
     *
     * @returns `true` if the draggable element is within
     * the boundaries, `false` otherwise
     */
    protected _isInBounds(position: Position): boolean;
    /**
     * Calculates the nearest point within the
     * boundaries of a given point
     * @param position Free point position
     *
     * @returns nearest `Position` point within
     * the boundaries
     */
    protected _nearestBounds(position: Position): Position;
    /**
     * Gathers the computed margin of a DOM HTML element
     * @param element DOM HTML element
     *
     * @returns Computed margin of the element
     */
    protected _margin(element: HTMLElement): {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    /**
     * Gathers the computed padding of a DOM HTML element
     * @param element DOM HTML element
     *
     * @returns Computed padding of the element
     */
    protected _padding(element: HTMLElement): {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    /**
     * Updates the view by setting the draggable element
     * to its target position
     */
    protected _updateView(): void;
    /**
     * Attach mouse and touch listeners
     */
    protected _attachListeners(): void;
    /**
     * Removes mouse and touch listeners
     */
    protected _clearListeners(): void;
    /**
     * Behavior on mouse drag start
     * @param event Mouse event
     */
    protected _mouseDragStart(event: MouseEvent): void;
    /**
     * Behavior while mouse is dragging
     * @param event Mouse event
     */
    protected _mouseDrag(event: MouseEvent): void;
    /**
     * Behavior on mouse drag end
     * @param event Mouse event
     */
    protected _mouseDragEnd(event: MouseEvent): void;
    /**
     * Behavior on touch drag start
     * @param event Touch event
     */
    protected _touchDragStart(event: TouchEvent): void;
    /**
     * Behavior while touch dragging
     * @param event Touch event
     */
    protected _touchDrag(event: TouchEvent): void;
    /**
     * Behavior on touch drag end
     * @param event Touch event
     */
    protected _touchDragEnd(event: TouchEvent): void;
}
//# sourceMappingURL=drag.d.ts.map