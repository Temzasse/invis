import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

export function isBrowser() {
  return typeof window !== 'undefined';
}

const useIsomorphicLayoutEffect = isBrowser() ? useLayoutEffect : useEffect;

// Userland version of upcoming official `useEvent` React hook:
// RFC: https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
export function useEvent<T extends (...args: any[]) => any>(handler: T) {
  const handlerRef = useRef<T>();

  useIsomorphicLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: any[]) => {
    const fn = handlerRef.current;
    return fn?.(...args);
  }, []) as T;
}
