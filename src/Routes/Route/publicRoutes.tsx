import Error from '@pages/error/Loadable';
import SignIn from '@pages/signIn/Loadable';
import Paths from '@routes/paths';
// import { Route } from 'react-router';
import { Route } from 'react-router-dom';

import { PublicProtectedRoute } from '../PublicProtectedRoute';

export const PublicRoutes = (
  <Route element={<PublicProtectedRoute />}>
    <Route path={Paths.signIn} element={<SignIn />} />
    <Route path={Paths.error} element={<Error />} />
  </Route>
);
