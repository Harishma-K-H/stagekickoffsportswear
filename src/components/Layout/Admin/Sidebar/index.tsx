import { SidebarProps } from '@models/Sidebar';
import Paths from '@routes/paths';
import React, { useState } from 'react';
import { MdDashboardCustomize, MdOutlineChecklistRtl } from 'react-icons/md';
import { NavLink, useLocation } from 'react-router';

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const isRoute = (route: string) => pathname.includes(route);

  const [menuList] = useState([
    {
      title: 'Dashboard',
      link: Paths.Admin.dashboard,
      route: Paths.Admin.dashboard,
      Icon: <MdDashboardCustomize className="w-[22px] h-auto" />,
    },
    {
      title: 'Items',
      link: Paths.Admin.items,
      route: Paths.Admin.items,
      Icon: <MdOutlineChecklistRtl className="w-[22px] h-auto" />,
    },
  ]);

  return (
    <div className="border-r-2">
      <div className="hidden lg:flex items-center justify-between gap-2 px-6 py-4.5 lg:justify-center bg-white">
        <NavLink to={'#'}>
          <img
            src="/logo.png"
            alt="logo"
            className="w-32 mx-auto mt-1 mb-2 md:w-52 md:mb-5 md:mt-3"
          />
        </NavLink>
      </div>
      <aside
        className={`shadow-md lg:shadow-none absolute left-0 top-0 z-40 flex h-screen w-[260px] flex-col justify-between bg-white duration-300 ease-linear lg:static lg:translate-x-0 pt-24 lg:pt-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="overflow-y-scroll light-scrollbar">
          <div className="overflow-y-scroll light-scrollbar">
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear w- scrollbar-hide">
              <nav className="py-4 pl-3 mt-5 lg:mt-0 lg:pl-3">
                <ul className="mb-6 flex flex-col gap-2 text-[#191D23]">
                  {menuList?.map((menu, index) => {
                    return (
                      <li
                        key={index}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                      >
                        <NavLink
                          to={menu.link}
                          className={`group relative text-[#191D23] flex items-center gap-4 px-[15px] py-[13px] duration-300 ease-in-out text-[15px] rounded-[5px] hover:bg-[#E7EAEE]  ${isRoute(menu.route) && 'bg-[#E7EAEE] font-semibold '}`}
                        >
                          {menu.Icon}
                          {menu.title}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
