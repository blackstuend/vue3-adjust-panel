import { MaybeRefOrGetter } from "vue";

export declare const virtualBarDataDirectionKey =
  "data-adjust-resize-direction";
export declare const virtualBarDataCursorKey = "data-adjust-resize-cursor";

export declare enum DragResizeDirection {
  Top = "top",
  Right = "right",
  Bottom = "bottom",
  Left = "left",
}

export interface AdjustSizeOptions {
  /**
   * Directions for resizing.
   */
  directions: MaybeRefOrGetter<DragResizeDirection | DragResizeDirection[]>;
  /**
   * Default width of the element.
   */
  defaultWidth?: MaybeRefOrGetter<number | null | undefined>;
  /**
   * Default height of the element.
   */
  defaultHeight?: MaybeRefOrGetter<number | null | undefined>;
  /**
   * Minimum width of the element.
   */
  minWidth?: MaybeRefOrGetter<number | null | undefined>;
  /**
   * Minimum height of the element.
   */
  minHeight?: MaybeRefOrGetter<number | null | undefined>;
  /**
   * Maximum width of the element.
   */
  maxWidth?: MaybeRefOrGetter<number | null | undefined>;
  /**
   * Maximum height of the element.
   */
  maxHeight?: MaybeRefOrGetter<number | null | undefined>;
  /**
   * Bar size, default is 5px.
   */
  barSize?: MaybeRefOrGetter<number | null | undefined>;
  /**
   * Bar index, default is 0.
   */
  barIndex?: MaybeRefOrGetter<number | null | undefined>;
  /**
   * Persist resizing information, default is false.
   */
  persist?: boolean;
  /**
   * Persist key, required if persist is true.
   */
  persistKey?: string;
  /**
   * Persist storage, default is localStorage.
   */
  storage?: Storage;
  /**
   * Cursor style for left and right bars, default is ew-resize.
   */
  XAxisCursor?: MaybeRefOrGetter<string | null | undefined>;
  /**
   * Cursor style for top and bottom bars, default is ns-resize.
   */
  YAxisCursor?: MaybeRefOrGetter<string | null | undefined>;
  /**
   * Position of the element, default is relative.
   */
  position?: MaybeRefOrGetter<"absolute" | "relative" | "fixed" | "sticky">;
}

/**
 * Hook to adjust the size of an element by dragging bars.
 *
 * @param target The target element to be resized.
 * @param options Options for adjusting the size.
 */
export declare const useAdjustPanel: (
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: AdjustSizeOptions
) => void;
