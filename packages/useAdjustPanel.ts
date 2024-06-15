import { useElementSize } from "@vueuse/core";
import { MaybeRefOrGetter, watch, toValue, onMounted, isRef } from "vue";

export const virtualBarDataDirectionKey = "data-adjust-resize-direction";
export const virtualBarDataCursorKey = "data-adjust-resize-cursor";

export enum DragResizeDirection {
  Top = "top",
  Right = "right",
  Bottom = "bottom",
  Left = "left",
}

export interface AdjustSizeOptions {
  directions: MaybeRefOrGetter<DragResizeDirection | DragResizeDirection[]>;
  defaultWidth?: MaybeRefOrGetter<number | null | undefined>;
  defaultHeight?: MaybeRefOrGetter<number | null | undefined>;
  minWidth?: MaybeRefOrGetter<number | null | undefined>;
  minHeight?: MaybeRefOrGetter<number | null | undefined>;
  maxWidth?: MaybeRefOrGetter<number | null | undefined>;
  maxHeight?: MaybeRefOrGetter<number | null | undefined>;
  // bar size, default is 5px
  barSize?: MaybeRefOrGetter<number | null | undefined>;
  // bar index, default is 0
  barIndex?: MaybeRefOrGetter<number | null | undefined>;
  // default is false
  persist?: boolean;
  // if set persist to true, the key is required
  persistKey?: string;
  // persist storage, default use localStorage
  storage?: Storage;
  // left and right cursor style, default is ew-resize
  XAxisCursor?: MaybeRefOrGetter<string | null | undefined>;
  // top and bottom cursor style, default is ns-resize
  YAxisCursor?: MaybeRefOrGetter<string | null | undefined>;
  position?: MaybeRefOrGetter<"absolute" | "relative" | "fixed" | "sticky">;
}

export const useAdjustPanel = (
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: AdjustSizeOptions
) => {
  const { width, height } = useElementSize(target);
  const barList = [] as HTMLElement[];

  if (!options.storage) {
    options.storage = localStorage;
  }

  if (options.persist === undefined) {
    options.persist = false;
  }

  if (options.persist && !options.persistKey)
    throw new Error("persistKey is required when persist is true");

  onMounted(() => {
    // check directions is Ref
    if (isRef(options.directions) || options.directions instanceof Function) {
      watch(
        [options.directions],
        () => {
          const element = toValue(target);
          if (element) {
            handleElement(element);
          }
        },
        { immediate: true }
      );
    } else {
      const element = toValue(target);
      if (element) {
        handleElement(element);
      }
    }
  });

  function handleElement(el: HTMLElement) {
    const directions = toValue(options.directions);
    const defaultWidth = toValue(options.defaultWidth);
    const defaultHeight = toValue(options.defaultHeight);
    const minWidth = toValue(options.minWidth);
    const minHeight = toValue(options.minHeight);

    if (barList.length > 0) {
      barList.forEach((bar) => bar.remove());
    }

    if (options.minWidth) {
      el.style.width = `${minWidth}px`;
      el.style.minWidth = `${minWidth}px`;
    }

    if (options.minHeight) {
      el.style.height = `${minHeight}px`;
      el.style.minHeight = `${minHeight}px`;
    }

    if (options.defaultWidth) {
      el.style.width = `${defaultWidth}px`;
    }

    if (options.defaultHeight) {
      el.style.height = `${defaultHeight}px`;
    }

    // restore size from storage
    if (options.persist && options.persistKey) {
      const size = options.storage?.getItem(options.persistKey);

      if (size) {
        let w: number, h: number;

        try {
          ({ width: w, height: h } = JSON.parse(size));
        } catch (err) {
          throw new Error("Invalid size data in storage");
        }

        if (w) {
          el.style.minWidth = `${w}px`;
          el.style.width = `${w}px`;
        }

        if (h) {
          el.style.minHeight = `${h}px`;
          el.style.height = `${h}px`;
        }
      }
    }

    el.style.position = toValue(options.position) ?? "relative";

    if (
      directions === DragResizeDirection.Top ||
      directions.includes(DragResizeDirection.Top)
    ) {
      const bar = document.createElement("div");

      setBarCommonStyle(bar, DragResizeDirection.Top);
      bar.style.top = `-${(toValue(options.barSize || 5) as number) / 2}px`;
      bar.style.left = "0";

      el.appendChild(bar);

      barList.push(bar);

      bar.addEventListener("mousedown", handleMouseDown);
    }

    if (
      directions === DragResizeDirection.Right ||
      directions.includes(DragResizeDirection.Right)
    ) {
      const bar = document.createElement("div");
      bar.setAttribute(virtualBarDataDirectionKey, DragResizeDirection.Right);

      setBarCommonStyle(bar, DragResizeDirection.Right);
      bar.style.right = `-${(toValue(options.barSize || 5) as number) / 2}px`;
      bar.style.top = "0";

      el.appendChild(bar);
      bar.addEventListener("mousedown", handleMouseDown);
    }

    if (
      directions === DragResizeDirection.Bottom ||
      directions.includes(DragResizeDirection.Bottom)
    ) {
      const bar = document.createElement("div");
      bar.setAttribute(virtualBarDataDirectionKey, DragResizeDirection.Bottom);

      setBarCommonStyle(bar, DragResizeDirection.Bottom);
      bar.style.bottom = `-${(toValue(options.barSize || 5) as number) / 2}px`;
      bar.style.left = "0";

      el.appendChild(bar);

      barList.push(bar);
      bar.addEventListener("mousedown", handleMouseDown);
    }

    if (
      directions === DragResizeDirection.Left ||
      directions.includes(DragResizeDirection.Left)
    ) {
      const bar = document.createElement("div");
      bar.setAttribute(virtualBarDataDirectionKey, DragResizeDirection.Left);

      setBarCommonStyle(bar, DragResizeDirection.Left);
      bar.style.left = `-${(toValue(options.barSize || 5) as number) / 2}px`;
      bar.style.top = "0";

      el.appendChild(bar);

      barList.push(bar);
      bar.addEventListener("mousedown", handleMouseDown);
    }
  }

  function setBarCommonStyle(bar: HTMLElement, direction: DragResizeDirection) {
    let cursorStyle = "";

    if (
      direction === DragResizeDirection.Top ||
      direction === DragResizeDirection.Bottom
    ) {
      bar.style.width = "100%";
      bar.style.height = `${options.barSize ?? 5}px`;
      cursorStyle = toValue(options.YAxisCursor) ?? "ns-resize";
    }

    if (
      direction === DragResizeDirection.Right ||
      direction === DragResizeDirection.Left
    ) {
      bar.style.width = `${options.barSize ?? 5}px`;
      bar.style.height = "100%";
      cursorStyle = toValue(options.XAxisCursor) ?? "ew-resize";
    }

    bar.style.position = "absolute";
    bar.style.zIndex = `${options.barIndex}`;
    bar.style.cursor = cursorStyle;
    bar.setAttribute(virtualBarDataDirectionKey, direction);
    bar.setAttribute(virtualBarDataCursorKey, cursorStyle);
  }

  function handleMouseDown(e: MouseEvent) {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = width.value;
    const startHeight = height.value;
    const element = toValue(target);
    const currentDirection = (e.target as HTMLElement).getAttribute(
      virtualBarDataDirectionKey
    ) as DragResizeDirection;

    // when drag start, cursor always be ew-resize

    if (
      currentDirection === DragResizeDirection.Top ||
      currentDirection === DragResizeDirection.Bottom
    ) {
      document.body.style.cursor = toValue(options.YAxisCursor) ?? "ns-resize";
    } else {
      document.body.style.cursor = toValue(options.XAxisCursor) ?? "ew-resize";
    }

    const handleMouseMove = (e: MouseEvent) => {
      const minHeight = toValue(options.minHeight);
      const minWidth = toValue(options.minWidth);
      const maxHeight = toValue(options.maxHeight);
      const maxWidth = toValue(options.maxWidth);

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (
        currentDirection === DragResizeDirection.Top ||
        currentDirection === DragResizeDirection.Bottom
      ) {
        // check min height
        let newHeight = startHeight + dy;
        if (currentDirection === DragResizeDirection.Top) {
          newHeight = startHeight - dy;
        }

        if (minHeight && newHeight < minHeight) {
          newHeight = minHeight;
        }

        // check max height
        if (maxHeight && newHeight > maxHeight) {
          newHeight = maxHeight;
        }

        if (element) {
          element.style.minHeight = `${newHeight}px`;
          element.style.height = `${newHeight}px`;
        }
      }

      if (
        currentDirection === DragResizeDirection.Right ||
        currentDirection === DragResizeDirection.Left
      ) {
        // check min width
        let newWidth = startWidth + dx;

        if (currentDirection === DragResizeDirection.Left) {
          newWidth = startWidth - dx;
        }

        if (minWidth && newWidth < minWidth) {
          newWidth = minWidth;
        }

        // check max width
        if (maxWidth && newWidth > maxWidth) {
          newWidth = maxWidth;
        }

        if (element) {
          element.style.minWidth = `${newWidth}px`;
          element.style.width = `${newWidth}px`;
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const targetDirection = (e.target as HTMLElement).getAttribute(
        virtualBarDataDirectionKey
      ) as DragResizeDirection;

      // when drag end, cursor should be default
      document.body.style.cursor = "";

      // save size to storage
      if (options.persist && options.persistKey && options.storage) {
        const size: {
          width?: number;
          height?: number;
        } = {};

        if (
          targetDirection === DragResizeDirection.Right ||
          targetDirection === DragResizeDirection.Left
        ) {
          size.width = width.value;
        }

        if (
          targetDirection === DragResizeDirection.Top ||
          targetDirection === DragResizeDirection.Bottom
        ) {
          size.height = height.value;
        }

        options.storage.setItem(options.persistKey, JSON.stringify(size));
      }

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
};
