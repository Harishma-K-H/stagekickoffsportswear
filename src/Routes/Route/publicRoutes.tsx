import Error from '@pages/error/Loadable';
import SignIn from '@pages/signIn/Loadable';
import Paths from '@routes/paths';
import { Route } from 'react-router';

export const PublicRoutes = (
  <>
    <Route path={Paths.signIn} element={<SignIn />} />
    <Route path={Paths.error} element={<Error />} />
  </>
);
