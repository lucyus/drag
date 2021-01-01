import { Position } from './position';
import { DragOptions } from '../types/drag-options';
import { DragListeners } from '../types/drag-listeners';

/**
 * Drag makes DOM HTML elements draggable
*/
export class Drag {

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
  public get currentPosition(): Position {
    return this._currentPosition;
  }

  /**
   * Sets the relative position of the
   * draggable element and update the view
   */
  public set currentPosition(position: Position) {
    this._currentPosition = position;
    this._updateView();
  }

  /**
   * Boundary state of the draggable element
   * 
   * @returns `true` if a boundary is set, `false`
   * otherwise
   */
  public get hasBoundaries(): boolean {
    if(this._boundary) {
      return true;
    }
    return false;
  }

  /**
   * Checks if the draggable element is within the
   * boundaries
   * 
   * @returns `true` if the draggable element is
   * within the boundaries, `false` otherwise
   */
  public get isInBounds(): boolean {
    return this._isInBounds(this.currentPosition);
  }

  /**
   * Drag constructor
   * 
   * @param htmlElement DOM HTML element intended to be draggable
   * @param dragOptions Optional drag settings. They can also be
   * set after initialization
   */
  constructor(htmlElement: HTMLElement, dragOptions?: DragOptions | undefined) {
    this._htmlElement = htmlElement;
    this._mouseListeners = {
      dragStart: this._mouseDragStart.bind(this),
      drag: this._mouseDrag.bind(this),
      dragEnd: this._mouseDragEnd.bind(this),
    };
    this._touchListeners = {
      dragStart: this._touchDragStart.bind(this),
      drag: this._touchDrag.bind(this),
      dragEnd: this._touchDragEnd.bind(this),
    };
    this._currentPosition = new Position();
    if(dragOptions) {
      this.currentPosition = dragOptions.initialPosition ?  
        dragOptions.initialPosition : 
        new Position();
      this._handle = dragOptions.handle ? dragOptions.handle : this._htmlElement;
      this._isDraggable = dragOptions.isDraggable ? dragOptions.isDraggable : true;
      this._boundary = dragOptions.boundary;
    }
    else {
      this.currentPosition = new Position();
      this._handle = this._htmlElement;
      this._isDraggable = true;
    }
    this._startPosition = new Position(this.currentPosition.x, this.currentPosition.y);
    this._attachListeners();
  }

  /**
   * Enables draggability of the drag element
   */
  public enable(): void {
    this._isDraggable = true;
    this._attachListeners();
  }
  /**
   * Disables draggability of the drag element
   */
  public disable(): void {
    this._isDraggable = false;
    this._clearListeners();
  }
  /**
   * Toggle draggability of the drag element
   */
  public toggleDraggable(): void {
    this._isDraggable = !this._isDraggable;
    this._attachListeners();
  }

  /**
   * Sets the position of the drag element
   * @param position New position of the drag element
   */
  public setPosition(position: Position): void {
    this._currentPosition = position;
    this._startPosition = this.currentPosition;
    this._updateView();
  }

  /**
   * Set a handle for the drag element
   * @param handle DOM HTML element used for dragging
   */
  public setHandle(handle: HTMLElement): void {
    this._handle = handle;
    this._attachListeners();
  }

  /**
   * Remove the set handle and set
   * the whole drag element as the
   * default handle
   */
  public removeHandle(): void {
    this._clearListeners();
    this._handle = this._htmlElement;
    this._attachListeners();
  }

  /**
   * Sets the boundaries of the draggable element
   * @param boundary HTML DOM boundary element of the
   * draggable element
   */
  public setBoundary(boundary: HTMLElement | null): void {
    this._boundary = boundary;
  }

  /**
   * Removes the boundaries of the draggable element
   */
  public removeBoundary(): void {
    this._boundary = null;
  }

  /**
   * Checks if the draggable element is within
   * the boundary
   * @param position Position of the drag element
   * 
   * @returns `true` if the draggable element is within
   * the boundaries, `false` otherwise
   */
  protected _isInBounds(position: Position): boolean {
    if(!this._boundary) {
      return true;
    }
    const boundaryPadding = this._padding(this._boundary);
    return position.x >= 0 - boundaryPadding.left &&
      position.x <= this._boundary.clientWidth - this._htmlElement.clientWidth - boundaryPadding.right &&
      position.y >= 0 - boundaryPadding.top &&
      position.y <= this._boundary.clientHeight - this._htmlElement.clientHeight - boundaryPadding.bottom;
  }

  /**
   * Calculates the nearest point within the
   * boundaries of a given point
   * @param position Free point position
   * 
   * @returns nearest `Position` point within
   * the boundaries
   */
  protected _nearestBounds(position: Position): Position {
    const nearestBounds: Position = new Position(position.x, position.y);
    if (!this._boundary) {
      return nearestBounds;
    }
    const boundaryPadding = this._padding(this._boundary);
    if (position.x < 0 - boundaryPadding.left) {
      nearestBounds.x = 0 - boundaryPadding.left;
    }
    else if (position.x > this._boundary.clientWidth - this._htmlElement.clientWidth - boundaryPadding.right) {
      nearestBounds.x = this._boundary.clientWidth - this._htmlElement.clientWidth - boundaryPadding.right;
    }
    if (position.y < 0 - boundaryPadding.top) {
      nearestBounds.y = 0 - boundaryPadding.top;
    }
    else if (position.y > this._boundary.clientHeight - this._htmlElement.clientHeight - boundaryPadding.bottom) {
      nearestBounds.y = this._boundary.clientHeight - this._htmlElement.clientHeight - boundaryPadding.bottom;
    }
    return nearestBounds;
  }

  /**
   * Gathers the computed padding of a DOM HTML element
   * @param element DOM HTML element
   * 
   * @returns Computed padding of the element
   */
  protected _padding(element: HTMLElement): { top: number, left: number, right: number, bottom: number } {
    const elementStyle: CSSStyleDeclaration = getComputedStyle(element);
    return {
      top: parseFloat(elementStyle.getPropertyValue('padding-top')),
      left: parseFloat(elementStyle.getPropertyValue('padding-left')),
      right: parseFloat(elementStyle.getPropertyValue('padding-right')),
      bottom: parseFloat(elementStyle.getPropertyValue('padding-bottom'))
    };
  }

  /**
   * Updates the view by setting the draggable element
   * to its target position
   */
  protected _updateView(): void {
    this._htmlElement.style.transform = `translate3d(
      ${this.currentPosition.x}px, 
      ${this.currentPosition.y}px,
      0px)
      `;
  }

  /**
   * Attach mouse and touch listeners
   */
  protected _attachListeners(): void {
    this._clearListeners();
    if(this._isDraggable) {
      this._handle.addEventListener('mousedown', this._mouseListeners.dragStart, false);
      this._handle.addEventListener('touchstart', this._touchListeners.dragStart, false);
    }
  }

  /**
   * Removes mouse and touch listeners
   */
  protected _clearListeners(): void {
    this._handle.removeEventListener('mousedown', this._mouseListeners.dragStart, false);
    this._handle.removeEventListener('mousemove', this._mouseListeners.drag, false);
    this._handle.removeEventListener('mouseup', this._mouseListeners.dragEnd, false);
    this._handle.removeEventListener('touchstart', this._touchListeners.dragStart, false);
    this._handle.removeEventListener('touchmove', this._touchListeners.drag, false);
    this._handle.removeEventListener('touchend', this._touchListeners.dragEnd, false);
  }

  /**
   * Behavior on mouse drag start
   * @param event Mouse event
   */
  protected _mouseDragStart(event: MouseEvent): void {
    this._startPosition.x = event.clientX - this._currentPosition.x;
    this._startPosition.y = event.clientY - this._currentPosition.y;
    window.addEventListener('mousemove', this._mouseListeners.drag, false);
  }

  /**
   * Behavior while mouse is dragging
   * @param event Mouse event
   */
  protected _mouseDrag(event: MouseEvent): void {
    event.preventDefault();
    let newPosition: Position = new Position(
      event.clientX - this._startPosition.x,
      event.clientY - this._startPosition.y
    );
    if (this._isInBounds(newPosition)) {
      this.currentPosition = newPosition;
    }
    else if (this._boundary) {
      this.currentPosition = this._nearestBounds(newPosition);
    }
    window.addEventListener('mouseup', this._mouseListeners.dragEnd, false);
  }
  /**
   * Behavior on mouse drag end
   * @param event Mouse event
   */
  protected _mouseDragEnd(event: MouseEvent): void {
    window.removeEventListener('mousemove', this._mouseListeners.drag, false);
    window.addEventListener('mouseup', this._mouseListeners.dragEnd, false);
  }

  /**
   * Behavior on touch drag start
   * @param event Touch event
   */
  protected _touchDragStart(event: TouchEvent): void {
    this._startPosition.x = event.touches[0].clientX - this._currentPosition.x;
    this._startPosition.y = event.touches[0].clientY - this._currentPosition.y;
    window.addEventListener('touchmove', this._touchListeners.drag, { passive: false });
  }

  /**
   * Behavior while touch dragging
   * @param event Touch event
   */
  protected _touchDrag(event: TouchEvent): void {
    event.preventDefault();
    let newPosition: Position = new Position(
      event.touches[0].clientX - this._startPosition.x,
      event.touches[0].clientY - this._startPosition.y
    );
    if (this._isInBounds(newPosition)) {
      this.currentPosition = newPosition;
    }
    else if (this._boundary) {
      this.currentPosition = this._nearestBounds(newPosition);
    }
    window.addEventListener('touchend', this._touchListeners.dragEnd, false);
  }

  /**
   * Behavior on touch drag end
   * @param event Touch event
   */
  protected _touchDragEnd(event: TouchEvent): void {
    window.removeEventListener('touchmove', this._touchListeners.drag, false);
    window.addEventListener('touchend', this._touchListeners.dragEnd, false);
  }

}