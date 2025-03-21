// import ScrollToTopButton from '@components/Common/ScrollToTopButton';
import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router';

import Header from './Header/index';
import Sidebar from './Sidebar';

const SubscriberLayout: React.FC<{}> = () => {
  const { pathname } = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname]);

  return (
    <div className="bg-[#F8FAFC]">
      {/* <ScrollToTopButton containerRef={containerRef} /> */}

      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div
          className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto"
          ref={containerRef}
        >
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="p-3 pb-20 mx-auto w-screen-2xl xl:p-4 2xl:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SubscriberLayout;
