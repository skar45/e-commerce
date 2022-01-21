import { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { iError } from './Icons';

const ErrorDisplay = ({
  message,
  close,
}: {
  message: string;
  close: () => void;
}) => {
  const [el, setEl] = useState(document.createElement('div'));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  return mounted
    ? createPortal(<Display message={message} close={close} />, el)
    : null;
};

const Display = ({
  message,
  close,
}: {
  message: string;
  close: () => void;
}) => {
  useEffect(() => {
    setTimeout(() => close(), 5000);
  }, []);

  return (
    <div className="absolute bottom-20">
      <div className="fixed flex justify-center w-full z-50">
        <div className=" max-w-sm w-full float-right bg-red-400 border shadow-lg rounded-lg p-3">
          <div className="flex justify-between items-center gap-2 ">
            {iError}
            <span className="text-white">{message}</span>
            <button
              className="p-2 bg-white text-red-400"
              onClick={() => close()}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
