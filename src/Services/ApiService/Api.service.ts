import { resetUser } from '@redux/reducers/auth/reducer';
import { selectAccessToken } from '@redux/reducers/auth/selector';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { API_CONFIG } from './Api.config';
import { handleApiResponse } from './handleApiResponseError';

const useApi = (
  contentType: string = 'application/json',
  options?: AxiosRequestConfig,
) => {
  const dispatch = useDispatch<any>();
  const accessToken = useSelector(selectAccessToken);

  const service = axios.create({
    headers: {
      'Content-Type': contentType,
      ...(options?.headers || {}),
    },
    timeout: 30 * 1000,
    ...options,
  });

  // Request Interceptor
  service.interceptors.request.use(
    async (config) => {
      const token = accessToken;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response Interceptor
  service.interceptors.response.use(
    (response) => {
      // Handle API response with custom handler
      return handleApiResponse(response);
    },
    async (error: AxiosError) => {
      // const originalRequest: any = error.config;
      if (error.response?.status === 401 || error.response?.status === 403) {
        // && !originalRequest?.sent
        dispatch(resetUser());

        // Handle token refresh logic here if necessary
        return Promise.reject(error);
      }

      return Promise.reject(error);
    },
  );

  // API Methods (get, post, put, patch, delete)
  const get = useCallback(<T>(url: string, config?: AxiosRequestConfig) => {
    return service.get<T>(url, config);
  }, []);

  const post = useCallback(
    <T>(url: string, payload: any, config?: AxiosRequestConfig) => {
      return service.post<T>(url, payload, config);
    },
    [],
  );

  const put = useCallback(
    <T>(url: string, payload: any, config?: AxiosRequestConfig) => {
      return service.put<T>(url, payload, config);
    },
    [],
  );

  const patch = useCallback(
    <T>(url: string, payload: any, config?: AxiosRequestConfig) => {
      return service.patch<T>(url, payload, config);
    },
    [],
  );

  const deleteRequest = useCallback(
    <T>(url: string, config?: AxiosRequestConfig) => {
      return service.delete<T>(url, config);
    },
    [],
  );

  return { get, post, put, patch, deleteRequest };
};

// Export for JSON payloads
export const useApiJSON = () => useApi('application/json', API_CONFIG);

// Export for FormData payloads
export const useApiFormData = () => useApi('multipart/form-data', API_CONFIG); // Note: 'multipart/form-data' is placeholder; actual header set by browser
