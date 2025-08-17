import axios from 'axios';
import { API_URL } from "./config";
import { subscription_key } from "./config";

const api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscription_key,
      },
});
export const createRent = (data: any) => api.post(`/createRent`, data);
export const GetRents = (data: any) => api.post(`/GetRents`, data);
export const GetRent = (id: string) => api.get(`/GetRent?id=${id}`);
export const updateRent = ( data: any) => api.post(`/updateRent`, data);
export const DeleteRent = (id: string) => api.post(`/DeleteRent?id=${id}`);
export const GetPendingRents = (data: any) => api.post(`/GetPendingRents`, data);

export const GetAllTenants = (data: any) => api.post(`/GetAllTenants`, data);