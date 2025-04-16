import { message } from 'antd';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const notify = (msg: any, type: ToastType): void => {
  message[type](msg);
};
