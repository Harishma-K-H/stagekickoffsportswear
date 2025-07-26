import PageLoader from '@components/Common/PageLoader';
import loadable from '@utils/loadable';

export default loadable(() => import('./index'), {
  fallback: <PageLoader />,
});
