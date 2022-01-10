import { menuItem } from './types';

const NavPopup = ({ menuData }: { menuData: menuItem[] }) => {
  return (
    <div>
      <div className="absolute hidden mt-2 w-max max-w-m transform -translate-x-1/2 sm:flex">
        <div className="grid grid-cols-2 gap-2 rounded-lg shadow-lg ring-1 ring-black p-4 ring-opacity-25 bg-white">
          {menuData.map((item: menuItem, idx: number) => {
            return (
              <div
                className="flex gap-4 hover:bg-gray-200 p-4 rounded"
                key={idx}
                onClick={(e) => {
                  e.preventDefault;
                  console.log('hi');
                }}
              >
                <div className="justify-self-end">
                  <div className="ml-left-4 bg-blue-500 w-10 h-10 rounded p-2">
                    {item.icon}
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-left font-bold">{item.h}</p>
                  <p className="text-left text-opacity-50 overflow-clip">
                    {item.p}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavPopup;
