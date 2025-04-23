// import ScrollToTopButton from '@components/Common/ScrollToTopButton';
import Paths from '@routes/paths';
import React, { useEffect, useRef, useState } from 'react';
import { FaFileInvoice, FaUsers } from 'react-icons/fa';
import { FaClipboardList } from 'react-icons/fa6';
import { MdDashboardCustomize, MdOutlineChecklistRtl } from 'react-icons/md';
import { Outlet, useLocation } from 'react-router';

import Header from '../BaseLayout/Header';
import Sidebar from '../BaseLayout/Sidebar';

const AdminLayout: React.FC<{}> = () => {
  const { pathname } = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

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
      Icon: <FaClipboardList className="w-[22px] h-auto" />,
    },
    {
      title: 'Orders',
      link: Paths.Admin.orders,
      route: Paths.Admin.orders,
      Icon: <MdOutlineChecklistRtl className="w-[22px] h-auto" />,
    },
    {
      title: 'Invoices',
      link: Paths.Admin.invoices,
      route: Paths.Admin.invoices,
      Icon: <FaFileInvoice className="w-[22px] h-auto" />,
    },
    {
      title: 'Customers',
      link: Paths.Admin.customers,
      route: Paths.Admin.customers,
      Icon: <FaUsers className="w-[22px] h-auto" />,
    },
  ]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname]);

  return (
    <div className="bg-[#F8FAFC]">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex overflow-hidden">
        <div className="border-r-2 fixed top-[73px] left-0 z-40 flex flex-col justify-between h-screen pt-24 duration-300 ease-linear translate-x-0 bg-white shadow-md lg:shadow-none lg:translate-x-0 lg:pt-0">
          <Sidebar
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            menuList={menuList}
            type="ADMIN"
          />
        </div>
        <div
          className={`relative flex flex-col flex-1 overflow-x-hidden overflow-y-hidden ${isExpanded ? 'lg:ml-56' : 'lg:ml-20'} transition-all duration-300 ease-in-out`}
          ref={containerRef}
        >
          <main>
            <div className="p-3 pb-20 mx-auto w-screen-2xl xl:p-4 2xl:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
