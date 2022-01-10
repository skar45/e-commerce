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
}: {
  title: string;
  options: Select[];
}) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [boxState, dispatch] = useReducer<Reducer<State, Action>>(reducer, {
    selected: { name: title, action: null },
    options,
    open: false,
  });

  useWindowEvent('mousedown', (e) => {
    if (mainRef.current.contains(e.target)) return;
    if (boxState.open) dispatch({ type: ActionType.Close });
  });

  useEffect(() => {
    if (boxState.selected.action) boxState.selected.action();
  }, [boxState.selected]);

  return (
    <div className="relative text-gray-600" ref={mainRef}>
      <button
        className="flex justify-between border-2 w-24 bg-white px-2 py-1"
        onClick={(e) => {
          e.preventDefault();
          dispatch({ type: ActionType.Open });
        }}
      >
        <span>{boxState.selected.name}</span>
        <i>{iDown}</i>
      </button>

      {boxState.open && (
        <div className="absolute z-20 w-full flex flex-col justify-between bg-white border-2 shadow-lg">
          {options.map((val, i) => {
            return (
              <button
                className="hover:bg-purple-600 hover:text-white px-2 py-1"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({ type: ActionType.Select, data: val });
                  console.log('action dispatched');
                }}
                key={i}
              >
                {val.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectMenu;
