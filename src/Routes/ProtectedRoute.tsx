import PageLoader from '@components/Common/PageLoader';
import {
  selectAccessToken,
  selectUserId,
  selectUserRole,
} from '@redux/reducers/auth/selector';
import Paths from '@routes/paths';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router';

import UserRoles from './roles';

const ProtectedRoute: React.FC<{
  allowedRole: string;
  redirectTo: string;
  layout: any;
}> = ({ allowedRole, redirectTo, layout: Layout }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const accessToken = useSelector(selectAccessToken);
  const userId = useSelector(selectUserId);
  const userRole = useSelector(selectUserRole);

  const [isLoading, setIsLoading] = useState(false);
  // const [isLogged, setIsLogged] = useState<boolean>(false);

  // useEffect(() => {
  //   const checkUserLogin = async () => {
  //     setIsLoading(true);
  //     if (accessToken && userId && userRole) {
  //       // setIsLogged(true);
  //       if (pathname == Paths.signIn) {
  //         if (userRole === UserRoles.Staff) {
  //           navigate(Paths.Staff.dashboard);
  //         } else if (userRole === UserRoles.Admin) {
  //           navigate(Paths.Admin.dashboard);
  //         } else {
  //           navigate(Paths.signIn);
  //         }
  //       }
  //     } else {
  //       navigate(Paths.signIn);
  //     }

  //     // setIsLogged(true);
  //     setIsLoading(false);
  //   };

  //   checkUserLogin();
  // }, [accessToken]);

  if (isLoading) {
    return <PageLoader />;
  }

  // if (userRole !== allowedRole) {
  //   navigate(redirectTo);
  // }

  return Layout ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Outlet />
  );
};

export { ProtectedRoute };
