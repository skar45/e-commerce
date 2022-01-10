import { JsxElement } from 'typescript';
import {
  Fragment,
  useEffect,
  useRef,
  TouchEvent,
  useReducer,
  Reducer,
  useState,
} from 'react';
import { iNavNext, iNavPrev } from './Icons';

interface Action {
  type: ActionTypes;
  data?: Slides;
}

enum ActionTypes {
  previous,
  next,
  set,
}

const reducer = (state: Slides, action: Action) => {
  switch (action.type) {
    case ActionTypes.previous:
      state.previous();
      return state;
    case ActionTypes.next:
      state.next();
      return state;
    case ActionTypes.set:
      state = action.data;
      return state;
  }
};

const Carousel = ({ data, width }) => {
  const [controlState, dispatch] = useReducer<Reducer<Slides, Action>>(
    reducer,
    new Slides(data)
  );
  const sliderRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<JsxElement[]>([]);

  useEffect(() => {
    dispatch({ type: ActionTypes.set, data: new Slides(data) });
    setFrame(controlState.showSlide());
  }, [data]);

  const sWidth = parseInt(width);
  let touch: number = null;
  let final: number = 0;
  let translate: number = 0;

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const { clientX } = e.changedTouches[0];
    touch = clientX;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    const { clientX } = e.changedTouches[0];
    translate = clientX - touch + final;
    e.currentTarget.style.transform = `translate(${translate}px)`;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    final = translate;
    if (Math.abs(final) > parseInt(width) / 3) {
      if (final > 0) {
        animateSlide('left');
      } else {
        animateSlide('right');
      }
    } else {
      animateSlide('center');
      final = 0;
    }
  };

  const animateSlide = (dir: 'left' | 'right' | 'center', w = sWidth) => {
    const slideElem = sliderRef.current.style;
    switch (dir) {
      case 'left':
        slideElem.transition = 'transform 0.25s';
        slideElem.transform = `translate(${w}px)`;
        sliderRef.current.ontransitionend = () => {
          slideElem.transform = '';
          slideElem.transition = '';
          dispatch({ type: ActionTypes.previous });
          setFrame(controlState.showSlide());
        };
        break;
      case 'right':
        slideElem.transition = 'transform 0.25s';
        slideElem.transform = `translate(-${w}px)`;
        sliderRef.current.ontransitionend = () => {
          slideElem.transform = '';
          slideElem.transition = '';
          dispatch({ type: ActionTypes.next });
          setFrame(controlState.showSlide());
        };
        break;
      case 'center':
        slideElem.transition = 'transform 0.1s';
        slideElem.transform = `translate(0px)`;
        sliderRef.current.ontransitionend = () => {
          slideElem.transform = '';
          slideElem.transition = '';
        };
        break;
    }
  };
  return (
    <div className="relative overflow-hidden">
      <button
        className="absolute z-10 left-0 h-full w-1/5"
        onClick={() => {
          animateSlide('left');
        }}
      >
        <div className="flex place-content-center">{iNavPrev}</div>
      </button>
      <button
        className=" absolute right-0 z-10 h-full w-1/5"
        onClick={() => {
          animateSlide('right');
        }}
      >
        <div className="flex place-content-center">{iNavNext}</div>
      </button>
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        ref={sliderRef}
        style={{ width: `${sWidth * 3}px`, right: `${sWidth}px` }}
        className="relative flex justify-center"
      >
        {controlState.showSlide().map((e, i) => {
          return <Fragment key={i}>{e}</Fragment>;
        })}
      </div>
    </div>
  );
};

class Node {
  public val: JsxElement;
  public next: Node = null;
  public prev: Node = null;
  constructor(val) {
    this.val = val;
  }
}

class Slides {
  public head: Node = null;
  public tail: Node = null;
  public length: number = 0;
  constructor(items: JsxElement[]) {
    items.forEach((item, idx) => {
      this.push(item);
      if (idx === items.length - 1) {
        this.join();
      }
    });
  }

  private push(v) {
    let newNode = new Node(v);

    if (this.length === 0) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  private join() {
    this.head.prev = this.tail;
    this.tail.next = this.head;
  }

  public previous() {
    this.head = this.head.prev;
  }

  public next() {
    this.head = this.head.next;
  }

  public showSlide() {
    return [this.head.prev.val, this.head.val, this.head.next.val];
  }
}

export default Carousel;
