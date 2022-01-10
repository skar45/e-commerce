import { useEffect } from 'react';

const useWindowEvent = (type, listener) => {
  useEffect(() => {
    window.addEventListener(type, listener);
    return () => window.removeEventListener(type, listener);
  }, [type]);
};

export { useWindowEvent };
