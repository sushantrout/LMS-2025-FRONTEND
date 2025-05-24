import { GlobalKeys } from "@/types/constants/global-keys";
import { getCookie } from "@/util/helpers/cookie-helper";
import axios, {AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

type Data = any;
export const axiosInstance = axios.create();
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const httpClient = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.get<T>(`${BASE_URL}/${url}`, config);
  },

  post<T = any>(url: string, data?: Data, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.post<T>(`${BASE_URL}/${url}`, data, config);
  },

  put<T = any>(url: string, data?: Data, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.put<T>(`${BASE_URL}/${url}`, data, config);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.delete<T>(`${BASE_URL}/${url}`, config);
  },

  patch<T = any>(url: string, data?: Data, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.patch<T>(`${BASE_URL}/${url}`, data, config);
  },
};


 axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = getCookie(GlobalKeys.AUTH_COOKIE_NAME);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 