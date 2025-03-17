import { SidebarLinkGroupProps } from '@models/Sidebar';
import React, { useState } from 'react';

const SidebarLinkGroup: React.FC<SidebarLinkGroupProps> = ({
  children,
  activeCondition,
}) => {
  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return <li>{children(handleClick, open)}</li>;
};

export default SidebarLinkGroup;
