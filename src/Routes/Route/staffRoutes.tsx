import Layout from '@components/Layout/Staff/index';
import CustomerDetailsPage from '@pages/staff/customers/Details/Loadable';
import Customers from '@pages/staff/customers/Loadable';
import Dashboard from '@pages/staff/dashboard/Loadable';
import Invoices from '@pages/staff/invoices/Loadable';
import Reports from '@pages/staff/Reports/InvoiceReports/Loadable';
import EditOrder from '@pages/staff/orders/edit/Loadable';
import Orders from '@pages/staff/orders/Loadable';
import NewOrders from '@pages/staff/orders/new/Loadable';
import Paths from '@routes/paths';
import { Route } from 'react-router';

import { ProtectedRoute } from '../ProtectedRoute';
import UserRoles from '../roles';

export const StaffRoutes = (
  <Route
    element={
      <ProtectedRoute
        allowedRole={UserRoles.Staff}
        redirectTo={Paths.signIn}
        layout={Layout}
      />
    }
  >
    <Route path={Paths.Staff.dashboard} element={<Dashboard />} />
    <Route path={Paths.Staff.customers.index} element={<Customers />} />
    <Route
      path={Paths.Staff.customers.details()}
      element={<CustomerDetailsPage />}
    />
    <>
      <Route path={Paths.Staff.orders.index} element={<Orders />} />
      <Route path={Paths.Staff.orders.new} element={<NewOrders />} />
      <Route path={Paths.Staff.orders.edit()} element={<EditOrder />} />
    </>
    <Route path={Paths.Staff.invoices} element={<Invoices />} />
    <Route path={Paths.Staff.reports.invoiceReports} element={<Reports />} />
  </Route>
);
