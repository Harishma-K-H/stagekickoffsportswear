import { Tooltip } from 'antd';
import React from 'react';
import { BsBell } from 'react-icons/bs';

const NotificationIcon: React.FC = () => {
  return (
    <Tooltip
      placement="bottom"
      title={
        <span className="text-gray-400 text-xs">No notification here</span>
      }
    >
      <div className="relative bg-[#FFFAF1] p-[12px] rounded-[8px] hidden lg:inline-flex">
        {/* <span className="absolute top-1.5 right-1.5 bg-[#EB5757] w-2 h-2 rounded-full"></span> */}
        <BsBell className="text-[#FFA412] w-4 h-auto" />
      </div>
    </Tooltip>
  );
};

export default NotificationIcon;
