import { useEffect } from "react";

export function useEventListener<T extends Event>(
  eventName: keyof WindowEventMap,
  handler: (event: T) => void,
  element: HTMLElement | Window = window
) {
  useEffect(() => {
    // Make sure element supports addEventListener
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    // Add event listener
    element.addEventListener(eventName, handler as EventListener);

    // Remove event listener on cleanup
    return () => {
      element.removeEventListener(eventName, handler as EventListener);
    };
  }, [eventName, element, handler]);
}
