import { ChangeEvent } from 'react';

type Props = {
  placeholder: string;
  type: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

const Input = ({ placeholder, type, onChange, value }: Props) => {
  const focusHandler = () => {
    const { style } = document.getElementById('placeholder');
    style.transition = 'all 0.2s';
    style.fontSize = '12px';
    style.transform = 'translateY(-50%)';
  };

  return (
    <div className="relative" onClick={focusHandler}>
      <input
        className="w-full border-2 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
        type={type}
        onChange={onChange}
        value={value}
      />
      <div
        className="absolute font-extralight text-gray-500 top-0 p-2 z-0 bg-white"
        id="placeholder"
      >
        {placeholder}
      </div>
    </div>
  );
};

export default Input;
