import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { MenuItem, NavItems } from './types';

const NavLink = ({ navmenu }: { navmenu: NavItems }) => {
  const router = useRouter();

  if ('link' in navmenu.item) {
    const { link } = navmenu.item;
    return (
      <button type="button">
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
    <div
      className=""
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button type="button">
        <span className="hover:text-gray-500">{navmenu.name}</span>
      </button>
      {isOpen && <Menu menuData={navmenu.item.menu} title={navmenu.name} />}
    </div>
  );
};

const Menu = ({ menuData, title }: { menuData: MenuItem; title: string }) => {
  const router = useRouter();

  return (
    <div className="absolute flex w-screen p-4 gap-2 bg-white  left-0">
      <ol className="flex flex-col pl-8 py-4 gap-2 w-1/3">
        <li>{title}</li>
        {menuData.list.map((m, i) => {
          return (
            <li key={i}>
              <span
                className="hover:text-gray-300 cursor-pointer"
                onClick={() => router.push(`/${m.link}`)}
              >
                {m.name}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="flex gap-4 p-2">
        {menuData.showcase.map((m, i) => {
          return (
            <div
              key={i}
              className="flex flex-col hover:text-gray-300 cursor-pointer"
              onClick={() => router.push(`/${m.link}`)}
            >
              <Image
                src={`/${m.img}`}
                height={710}
                width={660}
                layout="intrinsic"
              />
              <span>{m.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NavLink;
