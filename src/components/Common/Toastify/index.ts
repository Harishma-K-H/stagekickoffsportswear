import 'react-toastify/dist/ReactToastify.css';

import { toast, ToastOptions } from 'react-toastify';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const notify = (msg: any, type: ToastType): void => {
  const options: ToastOptions = {
    position: toast.POSITION.TOP_RIGHT,
  };

  toast[type](msg, options);
};
