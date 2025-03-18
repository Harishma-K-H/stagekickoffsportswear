import ScrollToTopButton from '@components/Common/ScrollToTopButton';
import Paths from '@routes/paths';
import React, { useEffect, useRef, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FaRegFileAlt } from 'react-icons/fa';
import { FiPieChart } from 'react-icons/fi';
import { RxDashboard } from 'react-icons/rx';
import { TiHomeOutline } from 'react-icons/ti';
import { NavLink, Outlet, useLocation } from 'react-router';

import Sidebar from './Sidebar';

const AdminLayout: React.FC<{}> = () => {
  const { pathname } = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname]);

  const isRoute = (route: string) => pathname.includes(route);

  const [mobileMenuList] = useState([
    {
      title: 'Dashboard',
      link: Paths.Admin.dashboard,
      route: Paths.Admin.dashboard,
      Icon: <TiHomeOutline className="w-[22px] h-auto" />,
    },
  ]);

  return (
    <div className="bg-[#F8FAFC]">
      {/* <ScrollToTopButton containerRef={containerRef} /> */}

      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div
          className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto"
          ref={containerRef}
        >
          <main>
            <div className="p-3 pb-20 mx-auto w-screen-2xl xl:p-4 2xl:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <nav className="fixed w-[97%] p-2 py-2 mx-[1.5%] bg-white rounded-md shadow-xl bottom-2 xl:hidden">
        <ul className="flex gap-1 text-[#191D23] justify-between">
          {mobileMenuList.map((menu, index) => {
            return (
              <li key={index}>
                <NavLink
                  to={menu.link}
                  className={`group relative text-[#191D23] flex flex-col items-center px-2 py-2 pb-1 duration-300 ease-in-out text-[15px] rounded-[5px] hover:bg-[#E7EAEE]  ${isRoute(menu.route) && 'bg-[#E7EAEE] font-semibold '}`}
                >
                  {menu.Icon}
                  <span className="text-[10px]">{menu.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminLayout;
