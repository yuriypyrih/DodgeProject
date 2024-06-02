import axios from 'axios';
import { logout } from '../../../redux/slices/authSlice.ts';
import store from '../../../redux/store.ts';

const URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: URL,
  timeoutErrorMessage: 'Request took long to complete, times up!',
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // await delay(2000);

    config.headers.referrerPolicy = 'no-referrer';
    const token = localStorage.getItem('jwt_dodge');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
// Response interceptor to handle expired tokens
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      error.response.data.error.errorCode === 'MUST_LOGOUT'
    ) {
      // Token is expired or user is unauthorized, log out the user
      store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);

export const postRequest = (endpoint: string, body?: any): Promise<any> => {
  return axiosInstance.post(endpoint, { ...body }, {});
};

export const putRequest = (endpoint: string, body?: any): Promise<any> => {
  return axiosInstance.put(endpoint, { ...body }, {});
};

export const getRequest = (endpoint: string, params?: any): Promise<any> => {
  return axiosInstance.get(endpoint, { params });
};

export const patchRequest = (endpoint: string, body?: any): Promise<any> => {
  return axiosInstance.patch(endpoint, { ...body });
};

export const deleteRequest = (endpoint: string, params?: any): Promise<any> => {
  return axiosInstance.delete(endpoint, { params });
};
