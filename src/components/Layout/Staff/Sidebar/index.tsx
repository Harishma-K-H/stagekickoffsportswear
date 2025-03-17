import Button from '@components/Common/Button';
import { SidebarProps } from '@models/Sidebar';
import { resetUser } from '@redux/reducers/auth/reducer';
import { selectUserData } from '@redux/reducers/auth/selector';
import Paths from '@routes/paths';
import React, { useState } from 'react';
import { CgLogOut } from 'react-icons/cg';
import { MdDashboardCustomize } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdOutlineChecklistRtl } from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa";

import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate, Link } from 'react-router';
import { FaPlus } from 'react-icons/fa6';
import { IoSettings } from "react-icons/io5";

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { pathname } = location;

  const isRoute = (route: string) => pathname.includes(route);

  const [menuList] = useState([
    {
      title: 'Dashboard',
      link: Paths.Staff.dashboard,
      route: Paths.Staff.dashboard,
      Icon: <MdDashboardCustomize className="w-[22px] h-auto" />,
    },
    {
      title: 'Customers',
      link: Paths.Staff.customers,
      route: Paths.Staff.customers,
      Icon: <FaUsers className="w-[22px] h-auto" />,
    },
    {
      title: 'Orders',
      link: Paths.Staff.orders.index,
      route: Paths.Staff.orders.index,
      Icon: <MdOutlineChecklistRtl className="w-[22px] h-auto" />,
    },
    {
      title: 'Invoices',
      link: Paths.Staff.invoices,
      route: Paths.Staff.invoices,
      Icon: <FaFileInvoice className="w-[22px] h-auto" />,
    },
    {
      title: 'Settings',
      link: Paths.Staff.settings,
      route: Paths.Staff.settings,
      Icon: <IoSettings className="w-[22px] h-auto" />,
    },
  ]);

  const logout = () => {
    dispatch(resetUser());
    navigate(Paths.signIn);
  };

  const userData = useSelector(selectUserData);

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
          <Link
            to={Paths.Staff.orders.new}
            className="flex items-center justify-center gap-3 py-2 mx-3 mb-2 text-white rounded-sm lg:px-3 bg-primary"
          >
            <FaPlus />
            New Order
          </Link>
          <h3 className="px-3 lg:px-3 text-[#64748B] text-sm">Menu</h3>
          <div className="overflow-y-scroll light-scrollbar">
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear w- scrollbar-hide">
              <nav className="px-3 py-4 mt-5 lg:mt-0 lg:px-3">
                <ul className="mb-6 flex flex-col gap-2 text-[#191D23]">
                  {menuList.map((menu, index) => {
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
        <div className="flex flex-col justify-between gap-3 px-4 py-5.5 lg:py-6.5 lg:justify-center xl:mb-[100px]">
          <h3 className="text-[#64748B] text-sm">Profile</h3>
          <div className="flex items-center gap-2 ">
            <div className="flex-1 w-10 h-10 rounded-full bg-slate-500">
              <img
                src={userData?.avatar}
                alt="profile"
                className="w-full h-full bg-cover rounded-full"
              />
            </div>
            <div>
              <h5
                className="text-[#191D23] text-base truncate w-[180px] hover:cursor-pointer"
                title={userData?.name}
              >
                {userData?.name}
              </h5>
              <h6
                className="text-[#A0ABBB] text-sm truncate w-[180px]"
                title={userData?.email}
              >
                {userData?.email}
              </h6>
            </div>
          </div>
          <Button
            handleClick={logout}
            type="button"
            title="Log out"
            icon={<CgLogOut className="w-6 h-6" />}
            className="text-[#191D23] flex items-center gap-2 py-[10px] text-[16px] rounded-[5px] bg-[#F7F8F9] font-semibold justify-center"
            tooltip="Log out"
          />
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
