import { AxiosRequestConfig, AxiosResponse } from "axios";
import { httpClient } from "./http-service";

const BASE_URL = "lms/api";
type Data = any;

export const lmsService = {
  get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return httpClient.get<T>(`${BASE_URL}/${url}`, config);
  },

  post<T = any>(
    url: string,
    data?: Data,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return httpClient.post<T>(`${BASE_URL}/${url}`, data, config);
  },

  put<T = any>(
    url: string,
    data?: Data,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return httpClient.put<T>(`${BASE_URL}/${url}`, data, config);
  },

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return httpClient.delete<T>(`${BASE_URL}/${url}`, config);
  },

  patch<T = any>(
    url: string,
    data?: Data,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return httpClient.patch<T>(`${BASE_URL}/${url}`, data, config);
  },
};
