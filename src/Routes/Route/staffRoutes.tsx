import { Route } from 'react-router';

import { ProtectedRoute } from '../ProtectedRoute';
import UserRoles from '../roles';

import Paths from '@routes/paths';
import Layout from '@components/Layout/Staff';

import Dashboard from '@pages/staff/dashboard/Loadable';
import Customers from '@pages/staff/customers/Loadable';
import Orders from '@pages/staff/orders/Loadable';
import NewOrders from '@pages/staff/orders/new/Loadable';
import Invoices from '@pages/staff/invoices/Loadable';
import Settings from '@pages/staff/settings/Loadable';

export const StaffRoutes = (
    <Route element={
        <ProtectedRoute
            allowedRole={UserRoles.Staff}
            redirectTo={Paths.unauthorized}
            layout={Layout}
        />
    }>
        <Route path={Paths.Staff.dashboard} element={<Dashboard />} />
        <Route path={Paths.Staff.customers} element={<Customers />} />
        <>
            <Route path={Paths.Staff.orders.index} element={<Orders />} />
            <Route path={Paths.Staff.orders.new} element={<NewOrders />} />
        </>
        <Route path={Paths.Staff.invoices} element={<Invoices />} />
        <Route path={Paths.Staff.settings} element={<Settings />} />
    </Route>
);
