import {
  useEffect,
  useState,
  Fragment,
  useReducer,
  useRef,
  Dispatch,
  Reducer,
} from 'react';
import { useWindowEvent } from '../hooks/use-window-event';
import { iDown } from './Icons';

type Select = {
  name: string;
  icon?: JSX.Element;
  action: () => void;
};

enum ActionType {
  Close = 'close',
  Open = 'open',
  Select = 'select',
}

interface Action {
  type: ActionType;
  data?: Select;
}

interface State {
  selected: Select;
  options: Select[];
  open: boolean;
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.Close:
      state.open = false;
      return { ...state };
    case ActionType.Open:
      state.open = true;
      return { ...state };
    case ActionType.Select:
      state.selected = action.data;
      state.open = false;
      return { ...state };
  }
};

const SelectMenu = ({
  title,
  options,
  width,
}: {
  title: string;
  options: Select[];
  width?: string;
}) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [boxState, dispatch] = useReducer<Reducer<State, Action>>(reducer, {
    selected: { name: title, action: null },
    options,
    open: false,
  });

  useWindowEvent('mousedown', (e) => {
    if (mainRef.current.contains(e.target as Element)) return;
    if (boxState.open) dispatch({ type: ActionType.Close });
  });

  useEffect(() => {
    if (boxState.selected.action) boxState.selected.action();
  }, [boxState.selected]);

  return (
    <div className="relative text-gray-600 " ref={mainRef}>
      <button
        style={width && { width }}
        className="flex justify-between w-full bg-white px-2 py-1"
        onClick={(e) => {
          e.preventDefault();
          dispatch({ type: ActionType.Open });
        }}
      >
        <span className="m-auto">{boxState.selected.name}</span>
        <i>{iDown}</i>
      </button>

      {boxState.open && (
        <div className="absolute z-20 w-full flex flex-col items-center bg-white border-2 shadow-lg">
          {options.map((val, i) => {
            return (
              <button
                className="flex gap-1 hover:bg-purple-600 hover:text-white px-2 py-1 w-full"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({ type: ActionType.Select, data: val });
                }}
                key={i}
              >
                {val.icon} {val.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectMenu;
