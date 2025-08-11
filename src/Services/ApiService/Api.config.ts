// export const API_CONFIG = {
//   baseURL: import.meta.env.VITE_API_BASE_PATH,
// };
import config from '../config.service';

export const API_CONFIG = {
  baseURL: config.get('API_BASE_PATH'),
};