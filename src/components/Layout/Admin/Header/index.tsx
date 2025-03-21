import React from 'react';
import { Link } from 'react-router';

import DropdownLanguage from './DropdownLanguage';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';

const Header: React.FC<{
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}> = (props) => {
  return (
    <header className="sticky top-0 z-50 flex w-full bg-white dark:drop-shadow-none shadow-1 lg:hidden">
      <div className="flex items-center justify-between flex-grow px-4 py-4 xl:justify-end md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 xl:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-50 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm xl:hidden"
          >
            <span className="relative block w-5 h-5 cursor-pointer">
              <span className="absolute right-0 w-full h-full du-block">
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-gray-600 delay-[0] duration-200 ease-in-out dark:bg-black/50 ${!props.sidebarOpen && '!w-full delay-300'}`}
                />
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-gray-600 delay-150 duration-200 ease-in-out dark:bg-black/50 ${!props.sidebarOpen && 'delay-400 !w-full'}`}
                />
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-gray-600 delay-200 duration-200 ease-in-out dark:bg-black/50 ${!props.sidebarOpen && '!w-full delay-500'}`}
                />
              </span>
              <span className="absolute right-0 w-full h-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-gray-600 delay-300 duration-200 ease-in-out dark:bg-black/50 ${!props.sidebarOpen && '!h-0 !delay-[0]'}`}
                />
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-gray-600 duration-200 ease-in-out dark:bg-black/50 ${!props.sidebarOpen && '!h-0 !delay-200'}`}
                />
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link
            className="flex-shrink-0 block xl:hidden"
            to={'Paths.dashboard'}
          >
            <img src="/logo.png" alt="Logo" className="w-32" />
          </Link>
        </div>

        <div className="flex items-center gap-5 2xsm:gap-7">
          <DropdownLanguage />
          <div className="flex items-center gap-3">
            <DropdownNotification />
            <DropdownUser />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
