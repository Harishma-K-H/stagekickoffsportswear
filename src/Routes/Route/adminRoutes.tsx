import Layout from '@components/Layout/Admin';
import Dashboard from '@pages/admin/dashboard/Loadable';
import Paths from '@routes/paths';
import { Route } from 'react-router';

import { ProtectedRoute } from '../ProtectedRoute';
import UserRoles from '../roles';

export const AdminRoutes = (
  <Route
    element={
      <ProtectedRoute
        allowedRole={UserRoles.Admin}
        redirectTo={Paths.signIn}
        layout={Layout}
      />
    }
  >
    <Route path={Paths.Admin.dashboard} element={<Dashboard />} />
  </Route>
);
