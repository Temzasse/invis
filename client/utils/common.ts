import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isBrowser() {
  return typeof window !== 'undefined';
}

const useIsomorphicLayoutEffect = isBrowser() ? useLayoutEffect : useEffect;

// Userland version of upcoming official `useEffectEvent` React hook:
// TODO: consider renaming this to `useEffectEvent` when the hooks gets released...
export function useStableCallback<T extends (...args: any[]) => any>(
  handler: T
) {
  const handlerRef = useRef<T>();

  useIsomorphicLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: any[]) => {
    const fn = handlerRef.current;
    return fn?.(...args);
  }, []) as T;
}

export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
