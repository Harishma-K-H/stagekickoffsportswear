import Layout from '@components/Layout/Admin';
import Customers from '@pages/admin/customers/Loadable';
import Dashboard from '@pages/admin/dashboard/Loadable';
import Invoices from '@pages/admin/invoices/Loadable';
import Items from '@pages/admin/items/Loadable';
import Orders from '@pages/admin/orders/Loadable';
import Paths from '@routes/paths';
import { Route } from 'react-router';
import CustomerDetailsPage from '@pages/admin/customers/Details/Loadable'; 
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
    <Route path={Paths.Admin.items} element={<Items />} />
    <Route path={Paths.Admin.orders} element={<Orders />} />
    <Route path={Paths.Admin.invoices} element={<Invoices />} />
    <Route path={Paths.Admin.customers.index} element={<Customers />} />
    <Route path={Paths.Admin.customers.details()} element={<CustomerDetailsPage />} />
  </Route>
);
