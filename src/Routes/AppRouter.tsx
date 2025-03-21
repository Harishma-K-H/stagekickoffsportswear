import {
  selectAccessToken,
  selectUserRole,
} from '@redux/reducers/auth/selector';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, useLocation, useNavigate } from 'react-router';

import Paths from './paths';
import UserRoles from './roles';
import { AdminRoutes } from './Route/adminRoutes';
import { PublicRoutes } from './Route/publicRoutes';
import { StaffRoutes } from './Route/staffRoutes';

const AppRouter: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const accessToken = useSelector(selectAccessToken);
  const userRole = useSelector(selectUserRole);

  useEffect(() => {
    if (accessToken) {
      if (pathname == Paths.signIn) {
        if (userRole === UserRoles.Staff) {
          navigate(Paths.Staff.dashboard);
        } else if (userRole === UserRoles.Admin) {
          navigate(Paths.Admin.dashboard);
        } else {
          navigate(Paths.signIn);
        }
      }
    } else if (pathname == '/') {
      navigate(Paths.signIn);
    }
  }, [accessToken]);

  return (
    <Routes>
      {PublicRoutes}
      {StaffRoutes}
      {AdminRoutes}
    </Routes>
  );
};

export { AppRouter };
