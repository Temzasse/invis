import { useEffect, useState } from 'react';

export function useKeyboardOpen() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const visualViewport = window.visualViewport;
    const windowHeight = window.innerHeight;

    if (visualViewport) {
      visualViewport.addEventListener('resize', () => {
        const focusedElement = document.activeElement?.tagName;
        const inputElements = ['INPUT', 'TEXTAREA'];

        // If there is a focused input and the visual viewport height has changed
        // it is very likely that the keyboard has been opened or closed.
        if (
          focusedElement &&
          inputElements.includes(focusedElement) &&
          visualViewport.height < windowHeight
        ) {
          setIsKeyboardOpen(true);
        } else {
          setIsKeyboardOpen(false);
        }
      });
    }
  }, []);

  return isKeyboardOpen;
}
