import router from 'next/router';
import Link from 'next/link';
import {
  BaseSyntheticEvent,
  useState,
  Fragment,
  useRef,
  useEffect,
} from 'react';
import { useWindowEvent } from '../hooks/use-window-event';
import { iClose, iMenu } from './Icons';
import { NavItems, MenuItem } from './types';
import SignUp from './signinModal';
import { useStore } from '../store/user-context';
import { signoutRequest } from '../api/requests';

const ResponsiveMenu = ({ items }: { items: NavItems[] }) => {
  const [toggle, setToggle] = useState(false);
  const [login, setLogin] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useWindowEvent('click', (e) => {
    if (mainRef.current.contains(e.target as Element)) return;
    setToggle(false);
  });

  return (
    <div className="flex content-center sm:hidden" ref={mainRef}>
      <button className="" onClick={() => setToggle(!toggle)}>
        {toggle ? <i>{iClose}</i> : <i>{iMenu}</i>}
      </button>
      <div className="sm:hidden">
        {toggle && (
          <MobilePopup
            elements={items}
            close={() => setToggle(false)}
            loginModal={() => setLogin(true)}
          />
        )}
        {login && <SignUp close={() => setLogin(false)} />}
      </div>
    </div>
  );
};

const MobilePopup = ({
  elements,
  close,
  loginModal,
}: {
  elements: NavItems[];
  close: () => void;
  loginModal: () => void;
}) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [{ username }] = useStore();

  useEffect(() => {
    mainRef.current.style.transition = 'all 2s';
    mainRef.current.style.maxHeight = '100vh';
  }, []);

  return (
    <div
      ref={mainRef}
      className="absolute mt-10 w-screen ml-4 border-2 bg-white transform -translate-x-full max-h-0 overflow-y-hidden shadow-md"
    >
      <div className="flex flex-col items-center space-y-2 p-4">
        <Link href="/cart">Cart</Link>

        {elements.map((elem, idx) => {
          if ('menu' in elem.item) {
            return (
              <Fragment key={idx}>
                <Menu item={elem.item.menu} name={elem.name} close={close} />
              </Fragment>
            );
          } else {
            const { link } = elem.item;
            return (
              <div key={idx} onClick={() => close()}>
                <Link href={`/${link}`}>{elem.name}</Link>
              </div>
            );
          }
        })}
        {username ? (
          <div
            className="text-center w-full p-2 bg-gray-200 rounded-lg"
            onClick={async () => {
              await signoutRequest();
              window.location.reload();
            }}
          >
            Sign out from {username}
          </div>
        ) : (
          <div
            className="flex flex-rows w-full"
            onClick={() => {
              loginModal();
            }}
          >
            <div className="w-1/2 text-center">Sign Up</div>
            <div className="w-1/2 text-center">Sign In</div>
          </div>
        )}
      </div>
    </div>
  );
};

const Menu = ({
  item,
  name,
  close,
}: {
  item: MenuItem;
  name: string;
  close: () => void;
}) => {
  const [list, setList] = useState<MenuItem['list'] | MenuItem['showcase']>([]);

  return (
    <>
      <div
        className="flex"
        onClick={(e: BaseSyntheticEvent) => {
          e.preventDefault();

          if (list.length > 0) {
            setList([]);
          } else {
            setList(item.list.concat(item.showcase));
          }
        }}
      >
        {name}
        {list.length > 0 ? (
          <span className="material-icons">expand_less</span>
        ) : (
          <span className="material-icons">expand_more</span>
        )}
      </div>
      {list.length > 0 && <SubMenu items={list} close={close} />}
    </>
  );
};

const SubMenu = ({
  items,
  close,
}: {
  items: { name: string; link: string; img?: string }[];
  close: () => void;
}) => {
  const subRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    subRef.current.style.transition = 'all 2s';
    subRef.current.style.maxHeight = '100vh';
  }, []);

  return (
    <div
      ref={subRef}
      className="flex flex-col items-center w-full gap-2 py-2 bg-gray-300 max-h-0 overflow-y-hidden"
    >
      {items.map((l, i) => (
        <div key={i} onClick={() => close()}>
          <Link href={`/${l.link}`}>{l.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default ResponsiveMenu;
