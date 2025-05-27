import { AxiosResponse } from "axios";
import { httpClient } from "./http-service";

export const getPrincipal = async ()=> {
    try {
        const res: AxiosResponse = await httpClient.get(`api/principal`);
        return res.data;
      } catch (error) {
        throw error;
      }
}

export const getUSerTheme = async (userId: string, portal: string)=> {
    try {
        const res: AxiosResponse = await httpClient.get(`api/principal/user/${userId}/${portal}`);
        return res.data;
      } catch (error) {
        throw error;
      }
}