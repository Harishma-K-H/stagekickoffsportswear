import { SidebarProps } from '@models/Sidebar';
import Paths from '@routes/paths';
import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa6';
import { Link, NavLink, useLocation } from 'react-router';

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  isExpanded,
  setIsExpanded,
  menuList,
  type,
}) => {
  const location = useLocation();
  const { pathname } = location;

  const isRoute = (route: string) => pathname.includes(route);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="relative z-40 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute z-50 hidden p-2 transition-colors bg-white border-2 rounded-full shadow-md lg:block -right-4 top-10 hover:bg-gray-50"
      >
        {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      <aside
        className={`absolute left-0 top-0 z-40 flex overflow-y-hidden h-full flex-col justify-between bg-white transition-all duration-300 ease-in-out lg:static lg:translate-x-0 pt-24 lg:pt-0 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isExpanded ? 'w-[220px]' : 'w-[80px]'}`}
      >
        <div className="overflow-y-scroll light-scrollbar">
          {type === 'STAFF' && (
            <Link
              to={Paths.Staff.orders.new}
              title="New Order"
              className="flex items-center justify-center gap-3 py-2 mx-3 mb-2 text-white rounded-full bg-primary"
            >
              <FaPlus />
              {isExpanded && <span>New Order</span>}
            </Link>
          )}

          <div className="overflow-y-scroll light-scrollbar">
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear scrollbar-hide">
              <nav
                className={`py-4 ${isExpanded ? 'pl-3' : 'pl-2'} mt-5 lg:mt-0`}
              >
                <ul className="mb-6 flex flex-col gap-2 text-[#191D23]">
                  {menuList.map((menu, index) => (
                    <li key={index}>
                      {menu.children ? (
                        <>
                          <button
                            onClick={() => toggleOpen(index)}
                            className={`flex items-center gap-5 px-[15px] py-[13px] w-full rounded-[5px] hover:bg-[#E7EAEE] ${
                              openIndex === index &&
                              'bg-[#E7EAEE] font-semibold'
                            } ${!isExpanded && 'justify-center'}`}
                          >
                            <div className="text-[18px]">{menu.Icon}</div>
                            {isExpanded && <span>{menu.title}</span>}
                          </button>

                          {/* Submenu Items */}
                          {openIndex === index && (
                             <ul
                                className={`${
                                  isExpanded ? 'pl-6 pr-2' : 'hidden'
                                } mt-2 mb-2 flex flex-col gap-1`}
                              >
                              {menu.children.map(
                                (child: any, cIndex: number) => (
                                  <li key={cIndex}>
                                    <NavLink
                                      to={child.link}
                                      className={`flex items-center gap-3 px-[15px] py-[10px] text-[14px] rounded-[5px] hover:bg-[#F0F2F5] ${
                                        isRoute(child.route) &&
                                        'bg-[#E7EAEE] font-semibold'
                                      }`}
                                    >
                                      {child.Icon}
                                      <span>{child.title}</span>
                                    </NavLink>
                                  </li>
                                ),
                              )}
                            </ul>
                          )}
                        </>
                      ) : (
                        <NavLink
                          to={menu.link}
                          className={`group relative flex items-center gap-4 px-[15px] py-[13px] duration-300 ease-in-out text-[15px] rounded-[5px] hover:bg-[#E7EAEE] 
                            ${isRoute(menu.route) && 'bg-[#E7EAEE] font-semibold'}
                            ${!isExpanded && 'justify-center'}`}
                        >
                          <div
                            className={`${!isExpanded && 'tooltip-container'}`}
                          >
                            {menu.Icon}
                          </div>
                          {isExpanded && <span>{menu.title}</span>}
                        </NavLink>
                      )}
                    </li>
                  ))}
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
