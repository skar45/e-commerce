import {
  BaseSyntheticEvent,
  useState,
  Fragment,
  useRef,
  useEffect,
} from 'react';
import { navItems, menuItem } from './types';

const MobilePopup = ({ elements }: { elements: navItems[] }) => {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mainRef.current.style.transition = 'all 2s';
    mainRef.current.style.maxHeight = '100vh';
  }, []);

  return (
    <div
      ref={mainRef}
      className="absolute mt-10 w-screen ml-4 border-2 bg-white transform -translate-x-full max-h-0 overflow-y-hidden"
    >
      <div className="flex flex-col items-center space-y-2 p-4">
        <div>Cart</div>

        {elements.map((elem, idx) => {
          if (elem.item) {
            return (
              <Fragment key={idx}>
                <Menu item={elem} />
              </Fragment>
            );
          } else {
            return (
              <div key={idx} onClick={() => {}}>
                {elem.name}
              </div>
            );
          }
        })}
        <div className="flex flex-rows w-full ">
          <div className="w-1/2 text-center">Sign Up</div>
          <div className="w-1/2 text-center">Sign In</div>
        </div>
      </div>
    </div>
  );
};

const Menu = ({ item }: { item: navItems }) => {
  const [list, setList] = useState([]);

  return (
    <>
      <div
        className="flex"
        onClick={(e: BaseSyntheticEvent) => {
          e.preventDefault();

          if (list.length > 0) {
            setList([]);
          } else {
            setList(item.item);
          }
        }}
      >
        {item.name}
        {list.length > 0 ? (
          <span className="transform translate-y-0.5 material-icons">
            expand_less
          </span>
        ) : (
          <span className="transform translate-y-0.5 material-icons">
            expand_more
          </span>
        )}
      </div>
      {list.length > 0 && <SubMenu items={list} />}
    </>
  );
};

const SubMenu = ({ items }: { items: menuItem[] }) => {
  const subRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    subRef.current.style.transition = 'all 2s';
    subRef.current.style.maxHeight = '100vh';
  }, []);

  return (
    <div
      ref={subRef}
      className="flex flex-col items-center w-full bg-gray-300 max-h-0 overflow-y-hidden"
    >
      {items.map((i, idx) => (
        <div key={idx}>{i.h}</div>
      ))}
    </div>
  );
};

export default MobilePopup;
