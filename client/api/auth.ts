import api, { BaseResponse } from ".";
import { User } from "./user";
import { Credentials } from "@/app/(auth)/sign-in";
import { UserForm } from "@/app/(auth)/sign-up";

interface AuthResponse extends BaseResponse<User> {
  token: string;
}

export const registerUser = async (data: UserForm) =>
  api.post<AuthResponse>("/users/register", data).then((res) => res.data);

export const loginUser = async (data: Credentials) =>
  api.post<AuthResponse>("/users/login", data).then((res) => res.data);
