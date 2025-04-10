import { resetUser, setToken } from '@redux/reducers/auth/reducer';
import {
  selectAccessToken,
  selectRefreshToken,
} from '@redux/reducers/auth/selector';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { API_CONFIG } from './Api.config';
import { handleApiResponse } from './handleApiResponseError';

// Define a type for Axios config with a custom flag
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean; // Flag to prevent infinite retry loops
}

const useApi = (
  contentType: string = 'application/json',
  options?: AxiosRequestConfig,
) => {
  const dispatch = useDispatch<any>();
  const accessToken = useSelector(selectAccessToken);
  const refreshToken = useSelector(selectRefreshToken);

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

  // Function to refresh the access token
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await axios.post<{
        status_code: number;
        access: string;
        refresh?: string; // Optional, as your login response includes it but refresh might not
      }>(
        '/api/token/refresh/',
        { refresh: refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      );

      if (response.data.status_code !== 200) {
        throw new Error('Refresh token request failed');
      }

      const newAccessToken = response.data.access;
      const newRefreshToken = response.data.refresh || refreshToken; // Use existing refresh if not provided

      // Update tokens in Redux
      dispatch(
        setToken({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        }),
      );
      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      dispatch(resetUser()); // Logout if refresh fails
      return null;
    }
  };

  // Response Interceptor
  service.interceptors.response.use(
    (response) => {
      // Handle API response with custom handler
      return handleApiResponse(response);
    },
    async (error: AxiosError) => {
      const originalRequest: any = error.config as CustomAxiosRequestConfig;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry // Prevent infinite loop
      ) {
        originalRequest._retry = true;

        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return service(originalRequest); // Retry the original request
        }
      }

      // If refresh fails or error is 403, log out
      if (error.response?.status === 401 || error.response?.status === 403) {
        dispatch(resetUser());
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
