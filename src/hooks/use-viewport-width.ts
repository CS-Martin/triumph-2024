import { useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
  window.addEventListener('resize', onChange);
  return () => window.removeEventListener('resize', onChange);
};

const getSnapshot = () => window.innerWidth;

export function useViewportWidth(serverFallback: number = 1200) {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverFallback);
}
