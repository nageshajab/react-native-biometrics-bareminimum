import axios from 'axios';
import { API_URL,subscription_key } from "./config";

const api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscription_key,
      },
});
export const createEvent = (data: any) => api.post(`/createEvent`, data);
export const GetEvents = (data: any) => api.post(`/GetEvents`, data);
export const EventGet = (id: string) => api.get(`/EventGet?id=${id}`);
export const updateEvent = ( data: any) => api.post(`/updateEvent`, data);
export const EventDelete = (id: string) => api.post(`/EventDelete?id=${id}`);
