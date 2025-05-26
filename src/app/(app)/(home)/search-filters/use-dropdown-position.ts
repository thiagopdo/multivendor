import type { RefObject } from "react";

export function useDropdownPosition(
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>,
) {
  function getDropdownPosition() {
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropDownWith = 240; //width of dropdown(w-60 = 15rem = 240px)

    //calculate inital position
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    //check if dropdown would go off right edge
    if (left + dropDownWith > window.innerWidth) {
      //align to the right edge viewpoint
      left = rect.left + window.screenX - dropDownWith;

      //if still offscrren, align to the top edge viewpoint
      if (left < 0) {
        left = window.innerWidth - dropDownWith - 16;
      }
    }

    //ensure dropdown doest go off left edge
    if (left < 0) {
      left = 16;
    }

    return { top, left };
  }

  return { getDropdownPosition };
}
