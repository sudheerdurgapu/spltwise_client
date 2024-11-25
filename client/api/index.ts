import { removeToken } from "@/utils/authStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

export interface BaseResponse<T> {
  status: string;
  data: T;
}

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL + "/api/v1"
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await removeToken();
      router.replace('/');
    }

    return Promise.reject(error);
  }
);

export default api;
