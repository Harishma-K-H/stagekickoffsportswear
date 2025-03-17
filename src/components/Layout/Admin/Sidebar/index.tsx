import Button from '@components/Common/Button';
import { SidebarProps } from '@models/Sidebar';
import { resetUser } from '@redux/reducers/auth/reducer';
import { selectUserData } from '@redux/reducers/auth/selector';
import Paths from '@routes/paths';
import React, { useState } from 'react';
import { CgLogOut } from 'react-icons/cg';
import { FaRegFileAlt, FaUsers } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { FiPieChart } from 'react-icons/fi';
import { RiInformationLine } from 'react-icons/ri';
import { RxDashboard } from 'react-icons/rx';
import { TiHomeOutline } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router';

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { pathname } = location;

  const isRoute = (route: string) => pathname.includes(route);

  const [menuList] = useState([
    {
      title: 'Dashboard',
      link: Paths.Admin.dashboard,
      route: Paths.Admin.dashboard,
      Icon: <TiHomeOutline className="w-[22px] h-auto" />,
    },
  ]);

  const logout = () => {
    dispatch(resetUser());
    navigate(Paths.signIn);
  };

  const userData = useSelector(selectUserData);

  return (
    <div className="border-r-2">
      <div className="hidden xl:flex items-center justify-between gap-2 px-6 py-4.5 lg:justify-center bg-white">
        <Link to={Paths.Admin.dashboard}>
          <img
            src="/logo.png"
            alt="logo"
            className="w-32 mx-auto mt-1 mb-2 md:w-36 md:mb-5 md:mt-3"
          />
        </Link>
      </div>
      <aside
        className={`shadow-md lg:shadow-none absolute left-0 top-0 z-99 flex h-screen w-[260px] flex-col justify-between bg-white duration-300 ease-linear xl:static xl:translate-x-0 pt-20 xl:pt-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div>
          <Link
            to={`#`}
            className="flex items-center justify-center gap-3 py-2 mx-3 mb-2 text-white rounded-sm lg:px-3 bg-primary"
          >
            <FaPlus />
            New Program
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
                        <Link
                          to={menu.link}
                          className={`group relative text-[#191D23] flex items-center gap-4 px-[15px] py-[13px] duration-300 ease-in-out text-[15px] rounded-[5px] hover:bg-[#E7EAEE]  ${isRoute(menu.route) && 'bg-[#E7EAEE] font-semibold '}`}
                        >
                          {menu.Icon}
                          {menu.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 px-4 py-5.5 lg:py-6.5 lg:justify-center xl:mb-[130px]">
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
