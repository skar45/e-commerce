import { BaseSyntheticEvent, useState, Fragment } from 'react';
import { navItems, menuItem } from './types';

const MobilePopup = ({ elements }: { elements: navItems[] }) => {
  return (
    <div className="absolute mt-10 w-screen ml-4 border-2 bg-white transform -translate-x-full">
      <div className="flex flex-col items-center space-y-2 p-4">
        <div>Cart</div>

        {elements.map((elem, idx) => {
          if (elem.item) {
            const [list, setList] = useState([]);

            return (
              <Fragment key={idx}>
                <div
                  className="flex"
                  onClick={(e: BaseSyntheticEvent) => {
                    e.preventDefault();

                    if (list.length > 0) {
                      setList([]);
                    } else {
                      setList(elem.item);
                    }
                  }}
                >
                  {elem.name}
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
                {list.length > 0 && (
                  <div className="flex flex-col items-center w-full bg-gray-300">
                    <SubMenu items={[...list]} />
                  </div>
                )}
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

const SubMenu = ({ items }: { items: menuItem[] }) => {
  return (
    <>
      {items.map((i, idx) => (
        <div key={idx}>{i.h}</div>
      ))}
    </>
  );
};

export default MobilePopup;
