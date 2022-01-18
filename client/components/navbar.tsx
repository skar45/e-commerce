import {
  useEffect,
  useRef,
  useState,
  BaseSyntheticEvent,
  UIEvent,
} from 'react';
import Link from 'next/link';
import SignUp from './signinModal';
import NavPopup from './navPopup';
import MobilePopup from './navMobile';
import { navItems, ActionTypes } from './types';
import {
  iAccount,
  iClose,
  iLogin,
  iMenu,
  iSearch,
  iShopBag,
  iShoppingCart,
} from './Icons';
import Router, { useRouter } from 'next/router';
import { useStore } from '../store/user-context';
import { getUserRequest, signoutRequest } from '../api/requests';
import { useWindowEvent } from '../hooks/use-window-event';
import Logo from './logo';

const NavBar = () => {
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);
  const [navMenu, setNavMenu] = useState(false);
  const [mobileMenu, setMobile] = useState(false);
  const [signUpMenu, setSignUp] = useState(false);
  const [globalState] = useStore();

  useWindowEvent('scroll', () => {
    // if (window.location.pathname !== '/') {
    //   return;
    // }
    // if (window.scrollY > 0) {
    //   navRef.current.classList.add('bg-white');
    //   navRef.current.classList.remove('text-white');
    //   return;
    // }
    // navRef.current.classList.remove('bg-white');
    // navRef.current.classList.add('text-white');
  });
  const user = globalState.username;
  const cart = globalState.cartItems;
  const menu = [
    {
      h: 'lorem',
      p: 'Find more...',
      icon: <span className="material-icons">dashboard</span>,
    },
    {
      h: 'hello',
      p: 'isit me',
    },
  ];

  const items: navItems[] = [
    {
      name: 'Browse All',
      link: '/shop',
    },
    {
      name: 'Shop Women',
      item: menu,
    },
    {
      name: 'Shop Men',
    },
  ];

  const showMenu = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setNavMenu(true);

    document.addEventListener(
      'click',
      (event) => {
        setNavMenu(false);
      },
      { once: true }
    );
  };

  const showSideMenu = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    setMobile(!mobileMenu);
  };

  return (
    <div className="fixed z-30 ">
      <nav
        className="flex flex-row items-center p-4 border-b justify-between w-screen sm:px-16 bg-white"
        ref={navRef}
      >
        <div className="flex content-center">
          <Logo />
        </div>

        <div className="hidden  sm:flex flex-row items-center justify-between space-x-10 relative">
          {items.map((element, idx) => {
            if (element.item) {
              return (
                <button type="button" key={idx}>
                  <span className="hover:text-gray-500" onClick={showMenu}>
                    {element.name}
                  </span>
                  {navMenu && <NavPopup menuData={element.item} />}
                </button>
              );
            } else {
              return (
                <button
                  className="no-underline hover:underline hover:text-gray-500"
                  key={idx}
                  onClick={() => element.link && router.push(element.link)}
                >
                  {element.name}
                </button>
              );
            }
          })}
        </div>

        <div className="flex space-x-1">
          <button onClick={() => router.push('/search')}>
            <i>{iSearch}</i>
          </button>
          <div className="hidden sm:flex space-x-2">
            {user === null ? (
              <button
                onClick={(e) => {
                  setSignUp(true);
                }}
              >
                {iLogin}
              </button>
            ) : (
              <div
                className="flex items-center"
                onClick={async () => {
                  await signoutRequest();
                  window.location.reload();
                }}
              >
                <div className={`rounded-full  bg-red-500 text-white p-1`}>
                  {user[0]}
                </div>
                <span className="font-light text-gray-500 text-sm ml-1">
                  {user}
                </span>
              </div>
            )}

            {signUpMenu && <SignUp close={() => setSignUp(false)} />}
          </div>
          <Link href="/cart">
            <button className="relative pr-2">
              <div>{iShopBag}</div>
              <div className="absolute text-xs h-4 w-4 bg-blue-500 text-white rounded-full top-0 right-0 px-1">
                {cart > 0 && cart}
              </div>
            </button>
          </Link>
          <div className="flex content-center sm:hidden">
            <button className="" onClick={showSideMenu}>
              {mobileMenu ? <i>{iClose}</i> : <i>{iMenu}</i>}
            </button>
            <div className="sm:hidden">
              {mobileMenu && <MobilePopup elements={items} />}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
