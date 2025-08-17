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
export const createWatchlistItem = (data: any) => api.post(`/createWatchlistItem`, data);
export const GetWatchlistItems = (data: any) => api.post(`/GetWatchlistItems`, data);
export const getwachlistitem = (id: string) => api.get(`/getwachlistitem?id=${id}`);
export const updateWatchlistItem = ( data: any) => api.post(`/updateWatchlistItem`, data);
export const DeleteWatchlistitem = (id: string) => api.post(`/DeleteWatchlistitem?id=${id}`);
