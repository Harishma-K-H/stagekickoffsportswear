// import { Config } from '@models/Config';
// import { get as _get } from 'lodash';

// const config: Config = {
//   env: {
//     API_BASE_PATH: import.meta.env.VITE_API_BASE_PATH,
//   },
//   get(key: string, type: string = 'env') {
//     if (type === 'env') {
//       return _get(config, `env.${key}`, null);
//     }
//   },
// };

// export default config;

import { Config } from '@models/Config';
import { get as _get } from 'lodash';

const hostname = window.location.hostname;

const API_BASE_PATH = (() => {
  if (hostname === '139.59.71.247') {
    return 'https://139.59.71.247/api';  // Use HTTPS here
  } else if (hostname === 'stage.kickoffsportswear.app') {
    return 'https://stage.kickoffsportswear.app/api';
  } else {
    return import.meta.env.VITE_API_BASE_PATH;
  }
})();

const config: Config = {
  env: {
    API_BASE_PATH,
  },
  get(key: string, type: string = 'env') {
    if (type === 'env') {
      return _get(config, `env.${key}`, null);
    }
  },
};

export default config;