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