import { Config } from '@models/Config';
import { get as _get } from 'lodash';

const config: Config = {
  env: {
    API_BASE_PATH: import.meta.env.VITE_API_BASE_PATH,
  },
  get(key: string, type: string = 'env') {
    if (type === 'env') {
      return _get(config, `env.${key}`, null);
    }
  },
};

export default config;
