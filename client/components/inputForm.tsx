import { ChangeEvent, MouseEvent, useRef, HTMLInputTypeAttribute } from 'react';

type Props = {
  placeholder: string;
  type: HTMLInputTypeAttribute;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

const Input = ({ placeholder, type, onChange, value }: Props) => {
  const phRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusHandler = (e: MouseEvent) => {
    const { style } = phRef.current;
    phRef.current.classList.add('text-blue-500');
    style.transition = 'all 0.2s';
    style.fontSize = '14px';
    style.transform = 'translateY(-100%)';
    inputRef.current.focus();
  };

  return (
    <div
      className="relative"
      onClick={focusHandler}
      onFocus={(e) => {
        e.stopPropagation();
        inputRef.current.focus();
      }}
    >
      <input
        ref={inputRef}
        className="w-full border-2 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
        type={type}
        onChange={onChange}
        value={value}
      />
      <div
        ref={phRef}
        className="absolute top-0 ml-1 mt-2 px-1 bg-white text-gray-500 "
        id="placeholder"
      >
        {placeholder}
      </div>
    </div>
  );
};

export default Input;
