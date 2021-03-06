import { useRef, useState } from 'react';
import Link from 'next/link';
import SignUp from './signinModal';
import { NavItems } from './types';
import { iLogin, iSearch, iShopBag } from './Icons';
import { useStore } from '../store/user-context';
import { getUserRequest, signoutRequest } from '../api/requests';
import Logo from './logo';
import NavLink from './navPopup';
import ResponsiveMenu from './navMobile';
import SelectMenu from './selectionMenu';

const NavBar = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const [signUpMenu, setSignUp] = useState(false);
  const [globalState] = useStore();

  const user = globalState.username;
  const cart = globalState.cartItems;

  const items: NavItems[] = [
    {
      name: 'Browse All',
      item: { link: 'shop' },
    },
    {
      name: "Women's wear",
      item: {
        menu: {
          list: [
            {
              name: 'Browse All',
              link: 'category?category=women',
            },
          ],
          showcase: [
            {
              name: 'Winter Wear',
              link: 'category?category=women+jacket',
              img: 'w_wear2.jpg',
            },
            {
              name: 'Casual Wear',
              link: 'category?category=women&tag=casual',
              img: 'w_c4.jpg',
            },
            {
              name: 'Accessories',
              link: 'category?category=women+accessories',
              img: 'm_ac.jpg',
            },
          ],
        },
      },
    },
    {
      name: "Men's Wear",
      item: {
        menu: {
          list: [
            {
              name: 'Browse All',
              link: 'category?category=men',
            },
          ],
          showcase: [
            {
              name: 'Waterproof',
              link: 'category?=men&tag=waterproof',
              img: 'main1.jpg',
            },
            {
              name: 'Outdoor Footwear',
              link: 'category?category=men+boots',
              img: 'm_hi.jpg',
            },
            {
              name: 'Accessories',
              link: 'category?category=men+accessories',
              img: 'm_ac.jpg',
            },
          ],
        },
      },
    },
  ];

  return (
    <div className="fixed z-30 ">
      <nav
        className="flex flex-row items-center p-4 border-b justify-between w-screen sm:px-16 md:px-12 bg-white"
        ref={navRef}
      >
        <div className="flex content-center">
          <Logo />
        </div>

        <div className="hidden sm:flex flex-row items-center justify-between">
          {items.map((m, i) => {
            return (
              <div key={i}>
                <NavLink navmenu={m} />
              </div>
            );
          })}
        </div>

        <div className="flex space-x-1">
          <button>
            <Link href="/search">
              <i>{iSearch}</i>
            </Link>
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
              <SelectMenu
                title={user}
                options={[
                  {
                    action: async () => {
                      await signoutRequest();
                      window.location.reload();
                    },
                    name: 'Sign Out',
                  },
                ]}
              />
              // <div
              //   className="text-center p-2 bg-gray-200 rounded-lg cursor-pointer"
              //   onClick={async () => {
              //     await signoutRequest();
              //     window.location.reload();
              //   }}
              // >
              //   <span className="">{user}</span>
              // </div>
            )}

            {signUpMenu && <SignUp close={() => setSignUp(false)} />}
          </div>
          <Link href="/cart">
            <button className="relative pr-2">
              <div>{iShopBag}</div>
              {cart > 0 && (
                <div className="absolute text-xs h-4 w-4 bg-blue-500 text-white rounded-full top-0 right-0 px-1">
                  {cart}
                </div>
              )}
            </button>
          </Link>
          <ResponsiveMenu items={items} />
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
