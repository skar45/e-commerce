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
import { iShoppingCart } from './Icons';
import Router from 'next/router';
import { useStore } from '../store/user-context';
import { getUserRequest, signoutRequest } from '../api/requests';
import { useWindowEvent } from '../hooks/use-window-event';

const NavBar = () => {
  //console.log('rendered');
  const [navMenu, setNavMenu] = useState(false);
  const [mobileMenu, setMobile] = useState(false);
  const [signUpMenu, setSignUp] = useState(false);
  const [globalState] = useStore();

  const [navScroll, setNavScroll] = useState(false);
  useWindowEvent('scroll', () => {
    if (window.scrollY > 0) setNavScroll(true);
    else setNavScroll(false);
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
      name: 'stuff',
      link: '/shop',
    },
    {
      name: 'more stuff',
      item: menu,
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

  const randColor = () => {
    const rand = (Math.random() * 6) >> 0;
    switch (rand) {
      case 0:
        return 'red';
      case 1:
        return 'yellow';
      case 2:
        return 'green';
      case 3:
        return 'indigo';
      case 4:
        return 'violet';
      case 5:
        return 'pink';
    }
  };

  const showSideMenu = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    setMobile(!mobileMenu);
  };

  return (
    <div className="fixed z-30 ">
      <nav
        className={`flex flex-row items-center p-4 border-b justify-between w-screen sm:px-16 ${
          navScroll ? 'bg-white' : 'bg-transparent'
        }`}
      >
        <div className="flex content-center">
          <img
            className="h-10 w-10"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          />
        </div>
        <input className="w-1/2 sm:w-1/3 p-2 rounded focus:outline-none ring-2 focus:ring-blue-600"></input>
        <div className="hidden sm:flex flex-row items-center justify-between space-x-10 relative">
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
                  onClick={() => element.link && Router.push(element.link)}
                >
                  {element.name}
                </button>
              );
            }
          })}
        </div>

        <div className="hidden sm:flex space-x-4">
          {user === null ? (
            <button
              className="rounded-lg bg-blue-500 text-white py-2 px-4"
              onClick={(e) => {
                setSignUp(true);
              }}
            >
              Log In
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
          <Link href="/cart">
            <button className="flex items-center w-14 p-2 border-2 rounded-full">
              <div>{iShoppingCart}</div>
              <div>{cart > 0 && cart}</div>
            </button>
          </Link>
        </div>
        <div className="flex self-end content-center sm:hidden">
          <button className="self-end" onClick={showSideMenu}>
            {mobileMenu ? (
              <span className="material-icons">close</span>
            ) : (
              <span className="material-icons">menu</span>
            )}
          </button>
          <div className="sm:hidden">
            {mobileMenu && <MobilePopup elements={items} />}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
