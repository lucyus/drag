/**
 * 2D Position
 */
export class Position {
  
  /**
   * @public horizontal position
   */
  public x: number;

  /**
   * @public vertical position
   */
  public y: number;

  /**
   * 2D Position constructor
   * @param x horizontal position
   * @param y vertical position
   * @default x 0
   * @default y 0
   */
  constructor(
    x?: number | undefined,
    y?: number | undefined
  ) {
    this.x = x ?? 0;
    this.y = y ?? 0;
  }

}
