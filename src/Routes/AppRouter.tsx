import React from 'react';
import { Routes } from 'react-router';


import { AdminRoutes } from './Route/adminRoutes';
import { PublicRoutes } from './Route/publicRoutes';
import { StaffRoutes } from './Route/staffRoutes';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* <PublicRoutes /> */}
      {PublicRoutes}
      {StaffRoutes}
      {AdminRoutes}
    </Routes>
  );
};

export { AppRouter };
