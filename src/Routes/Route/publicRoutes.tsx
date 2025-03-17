import { Route } from 'react-router';

import Paths from '@routes/paths';
import SignIn from '@pages/signIn/Loadable';
import Error from '@pages/error/Loadable';


export const PublicRoutes = (
    <>
        <Route path={Paths.signIn} element={<SignIn />} />
        <Route path={Paths.error} element={<Error />} />
    </>
);
