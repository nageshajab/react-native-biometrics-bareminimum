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
export const createPassword = (data: any) => api.post(`/PasswordCreate`, data);
export const listPasswords = (data: any) => api.post(`/GetPasswords`, data);
export const getPassword = (id: string) => api.get(`/PasswordGet?id=${id}`);
export const updatePassword = ( data: any) => api.post(`/PasswordUpdate`, data);
export const deletePassword = (id: string) => api.post(`/PasswordDelete?id=${id}`);
