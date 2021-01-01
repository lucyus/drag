"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
/**
 * 2D Position
 */
var Position = /** @class */ (function () {
    /**
     * 2D Position constructor
     * @param x horizontal position
     * @param y vertical position
     * @default x 0
     * @default y 0
     */
    function Position(x, y) {
        this.x = x !== null && x !== void 0 ? x : 0;
        this.y = y !== null && y !== void 0 ? y : 0;
    }
    return Position;
}());
exports.Position = Position;
//# sourceMappingURL=position.js.map