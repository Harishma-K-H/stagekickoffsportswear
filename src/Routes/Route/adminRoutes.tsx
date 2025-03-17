import { Route } from 'react-router';

import { ProtectedRoute } from '../ProtectedRoute';
import UserRoles from '../roles';

import Paths from '@routes/paths';
import Layout from '@components/Layout/Admin';
import Dashboard from '@pages/admin/dashboard/Loadable';


export const AdminRoutes = (
    <Route element={
        <ProtectedRoute
            allowedRole={UserRoles.Admin}
            redirectTo={Paths.unauthorized}
            layout={Layout}
        />
    }>
        <Route path={Paths.Admin.dashboard} element={<Dashboard />} />
    </Route>
);
