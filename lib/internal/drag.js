"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drag = void 0;
var position_1 = require("./position");
/**
 * Drag makes DOM HTML elements draggable
*/
var Drag = /** @class */ (function () {
    /**
     * Drag constructor
     *
     * @param htmlElement DOM HTML element intended to be draggable
     * @param dragOptions Optional drag settings. They can also be
     * set after initialization
     */
    function Drag(htmlElement, dragOptions) {
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
        this._currentPosition = new position_1.Position();
        if (dragOptions) {
            this.currentPosition = dragOptions.initialPosition ?
                dragOptions.initialPosition :
                new position_1.Position();
            this._handle = dragOptions.handle ? dragOptions.handle : this._htmlElement;
            this._isDraggable = dragOptions.isDraggable ? dragOptions.isDraggable : true;
            this._boundary = dragOptions.boundary;
        }
        else {
            this.currentPosition = new position_1.Position();
            this._handle = this._htmlElement;
            this._isDraggable = true;
        }
        this._startPosition = new position_1.Position(this.currentPosition.x, this.currentPosition.y);
        this._attachListeners();
    }
    Object.defineProperty(Drag.prototype, "currentPosition", {
        /**
         * Relative position of the draggable
         * element currently
         *
         * @returns Current drag `Position`
         */
        get: function () {
            return this._currentPosition;
        },
        /**
         * Sets the relative position of the
         * draggable element and update the view
         */
        set: function (position) {
            this._currentPosition = position;
            this._updateView();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drag.prototype, "hasBoundaries", {
        /**
         * Boundary state of the draggable element
         *
         * @returns `true` if a boundary is set, `false`
         * otherwise
         */
        get: function () {
            if (this._boundary) {
                return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drag.prototype, "isInBounds", {
        /**
         * Checks if the draggable element is within the
         * boundaries
         *
         * @returns `true` if the draggable element is
         * within the boundaries, `false` otherwise
         */
        get: function () {
            return this._isInBounds(this.currentPosition);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Enables draggability of the drag element
     */
    Drag.prototype.enable = function () {
        this._isDraggable = true;
        this._attachListeners();
    };
    /**
     * Disables draggability of the drag element
     */
    Drag.prototype.disable = function () {
        this._isDraggable = false;
        this._clearListeners();
    };
    /**
     * Toggle draggability of the drag element
     */
    Drag.prototype.toggleDraggable = function () {
        this._isDraggable = !this._isDraggable;
        this._attachListeners();
    };
    /**
     * Sets the position of the drag element
     * @param position New position of the drag element
     */
    Drag.prototype.setPosition = function (position) {
        this._currentPosition = position;
        this._startPosition = this.currentPosition;
        this._updateView();
    };
    /**
     * Set a handle for the drag element
     * @param handle DOM HTML element used for dragging
     */
    Drag.prototype.setHandle = function (handle) {
        this._clearListeners();
        this._handle = handle;
        this._attachListeners();
    };
    /**
     * Remove the set handle and set
     * the whole drag element as the
     * default handle
     */
    Drag.prototype.removeHandle = function () {
        this._clearListeners();
        this._handle = this._htmlElement;
        this._attachListeners();
    };
    /**
     * Sets the boundaries of the draggable element
     * @param boundary HTML DOM boundary element of the
     * draggable element
     */
    Drag.prototype.setBoundary = function (boundary) {
        this._boundary = boundary;
    };
    /**
     * Removes the boundaries of the draggable element
     */
    Drag.prototype.removeBoundary = function () {
        this._boundary = null;
    };
    /**
     * Checks if the draggable element is within
     * the boundary
     * @param position Position of the drag element
     *
     * @returns `true` if the draggable element is within
     * the boundaries, `false` otherwise
     */
    Drag.prototype._isInBounds = function (position) {
        if (!this._boundary) {
            return true;
        }
        var boundaryPadding = this._padding(this._boundary);
        var dragMargin = this._margin(this._htmlElement);
        return position.x >= 0 - boundaryPadding.left - dragMargin.left &&
            position.x <= this._boundary.clientWidth - this._htmlElement.clientWidth - boundaryPadding.right - dragMargin.right &&
            position.y >= 0 - boundaryPadding.top - dragMargin.top &&
            position.y <= this._boundary.clientHeight - this._htmlElement.clientHeight - boundaryPadding.bottom - dragMargin.bottom;
    };
    /**
     * Calculates the nearest point within the
     * boundaries of a given point
     * @param position Free point position
     *
     * @returns nearest `Position` point within
     * the boundaries
     */
    Drag.prototype._nearestBounds = function (position) {
        var nearestBounds = new position_1.Position(position.x, position.y);
        if (!this._boundary) {
            return nearestBounds;
        }
        var boundaryPadding = this._padding(this._boundary);
        var dragMargin = this._margin(this._htmlElement);
        if (position.x < 0 - boundaryPadding.left - dragMargin.left) {
            nearestBounds.x = 0 - boundaryPadding.left - dragMargin.left;
        }
        else if (position.x > this._boundary.clientWidth - this._htmlElement.clientWidth - boundaryPadding.right - dragMargin.right) {
            nearestBounds.x = this._boundary.clientWidth - this._htmlElement.clientWidth - boundaryPadding.right - dragMargin.right;
        }
        if (position.y < 0 - boundaryPadding.top - dragMargin.top) {
            nearestBounds.y = 0 - boundaryPadding.top - dragMargin.top;
        }
        else if (position.y > this._boundary.clientHeight - this._htmlElement.clientHeight - boundaryPadding.bottom - dragMargin.bottom) {
            nearestBounds.y = this._boundary.clientHeight - this._htmlElement.clientHeight - boundaryPadding.bottom - dragMargin.bottom;
        }
        return nearestBounds;
    };
    /**
     * Gathers the computed margin of a DOM HTML element
     * @param element DOM HTML element
     *
     * @returns Computed margin of the element
     */
    Drag.prototype._margin = function (element) {
        var elementStyle = getComputedStyle(element);
        return {
            top: parseFloat(elementStyle.getPropertyValue('margin-top')),
            left: parseFloat(elementStyle.getPropertyValue('margin-left')),
            right: parseFloat(elementStyle.getPropertyValue('margin-right')),
            bottom: parseFloat(elementStyle.getPropertyValue('margin-bottom'))
        };
    };
    /**
     * Gathers the computed padding of a DOM HTML element
     * @param element DOM HTML element
     *
     * @returns Computed padding of the element
     */
    Drag.prototype._padding = function (element) {
        var elementStyle = getComputedStyle(element);
        return {
            top: parseFloat(elementStyle.getPropertyValue('padding-top')),
            left: parseFloat(elementStyle.getPropertyValue('padding-left')),
            right: parseFloat(elementStyle.getPropertyValue('padding-right')),
            bottom: parseFloat(elementStyle.getPropertyValue('padding-bottom'))
        };
    };
    /**
     * Updates the view by setting the draggable element
     * to its target position
     */
    Drag.prototype._updateView = function () {
        this._htmlElement.style.transform = "translate3d(\n      " + this.currentPosition.x + "px, \n      " + this.currentPosition.y + "px,\n      0px)\n      ";
    };
    /**
     * Attach mouse and touch listeners
     */
    Drag.prototype._attachListeners = function () {
        this._clearListeners();
        if (this._isDraggable) {
            this._handle.addEventListener('mousedown', this._mouseListeners.dragStart, false);
            this._handle.addEventListener('touchstart', this._touchListeners.dragStart, false);
        }
    };
    /**
     * Removes mouse and touch listeners
     */
    Drag.prototype._clearListeners = function () {
        this._handle.removeEventListener('mousedown', this._mouseListeners.dragStart, false);
        this._handle.removeEventListener('mousemove', this._mouseListeners.drag, false);
        this._handle.removeEventListener('mouseup', this._mouseListeners.dragEnd, false);
        this._handle.removeEventListener('touchstart', this._touchListeners.dragStart, false);
        this._handle.removeEventListener('touchmove', this._touchListeners.drag, false);
        this._handle.removeEventListener('touchend', this._touchListeners.dragEnd, false);
    };
    /**
     * Behavior on mouse drag start
     * @param event Mouse event
     */
    Drag.prototype._mouseDragStart = function (event) {
        this._startPosition.x = event.clientX - this._currentPosition.x;
        this._startPosition.y = event.clientY - this._currentPosition.y;
        window.addEventListener('mousemove', this._mouseListeners.drag, false);
    };
    /**
     * Behavior while mouse is dragging
     * @param event Mouse event
     */
    Drag.prototype._mouseDrag = function (event) {
        event.preventDefault();
        var newPosition = new position_1.Position(event.clientX - this._startPosition.x, event.clientY - this._startPosition.y);
        if (this._isInBounds(newPosition)) {
            this.currentPosition = newPosition;
        }
        else if (this._boundary) {
            this.currentPosition = this._nearestBounds(newPosition);
        }
        window.addEventListener('mouseup', this._mouseListeners.dragEnd, false);
    };
    /**
     * Behavior on mouse drag end
     * @param event Mouse event
     */
    Drag.prototype._mouseDragEnd = function (event) {
        window.removeEventListener('mousemove', this._mouseListeners.drag, false);
        window.addEventListener('mouseup', this._mouseListeners.dragEnd, false);
    };
    /**
     * Behavior on touch drag start
     * @param event Touch event
     */
    Drag.prototype._touchDragStart = function (event) {
        this._startPosition.x = event.touches[0].clientX - this._currentPosition.x;
        this._startPosition.y = event.touches[0].clientY - this._currentPosition.y;
        window.addEventListener('touchmove', this._touchListeners.drag, { passive: false });
    };
    /**
     * Behavior while touch dragging
     * @param event Touch event
     */
    Drag.prototype._touchDrag = function (event) {
        event.preventDefault();
        var newPosition = new position_1.Position(event.touches[0].clientX - this._startPosition.x, event.touches[0].clientY - this._startPosition.y);
        if (this._isInBounds(newPosition)) {
            this.currentPosition = newPosition;
        }
        else if (this._boundary) {
            this.currentPosition = this._nearestBounds(newPosition);
        }
        window.addEventListener('touchend', this._touchListeners.dragEnd, false);
    };
    /**
     * Behavior on touch drag end
     * @param event Touch event
     */
    Drag.prototype._touchDragEnd = function (event) {
        window.removeEventListener('touchmove', this._touchListeners.drag, false);
        window.addEventListener('touchend', this._touchListeners.dragEnd, false);
    };
    return Drag;
}());
exports.Drag = Drag;
//# sourceMappingURL=drag.js.map