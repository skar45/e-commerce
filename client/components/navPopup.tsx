import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { MenuItem, NavItems } from './types';

const NavLink = ({ navmenu }: { navmenu: NavItems }) => {
  const router = useRouter();

  if ('link' in navmenu.item) {
    const { link } = navmenu.item;
    return (
      <button type="button" className="px-4">
        <span
          className="hover:text-gray-500"
          onClick={() => router.push(`/${link}`)}
        >
          {navmenu.name}
        </span>
      </button>
    );
  }

  const [isOpen, setOpen] = useState(false);

  return (
    <div onMouseOver={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button">
        <span className="hover:text-gray-600 px-4 py-4">{navmenu.name}</span>
      </button>
      <div onClick={() => setOpen(false)}>
        {isOpen && <Menu menuData={navmenu.item.menu} title={navmenu.name} />}
      </div>
    </div>
  );
};

const Menu = ({ menuData, title }: { menuData: MenuItem; title: string }) => {
  const router = useRouter();

  return (
    <div className="absolute mt-4 flex w-screen p-4 border-b-2 shadow-2xl gap-2 bg-white left-0">
      <ol className="flex flex-col pl-8 py-4 gap-2 w-1/3">
        <li>{title}</li>
        {menuData.list.map((m, i) => {
          return (
            <li key={i}>
              <span
                className="hover:text-gray-600 hover:underline cursor-pointer"
                onClick={() => router.push(`/${m.link}`)}
              >
                {m.name}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="flex items-end gap-4 p-2">
        {menuData.showcase.map((m, i) => {
          return (
            <div
              key={i}
              className="flex flex-col items-center hover:text-gray-600 hover:underline cursor-pointer"
              onClick={() => router.push(`/${m.link}`)}
            >
              <div className="overflow-hidden">
                <Image
                  className="transform hover:scale-105"
                  src={`/${m.img}`}
                  height="710"
                  width="660"
                  loading="eager"
                />
              </div>

              <span>{m.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NavLink;
