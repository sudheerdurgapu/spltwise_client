import { queryOptions } from "@tanstack/react-query";
import api, { BaseResponse } from ".";
import { Expense } from "./expense";

interface UsersResponse extends BaseResponse<UserDetails[]> {}
interface UserResponse extends BaseResponse<UserDetailsWithDebtInfo> {}

export interface UserDetailsWithDebtInfo extends UserDetails {
  users: UserWithDebtInfo[];
}

interface UserDetails extends User {
  expensesPaid: Expense[];
  expensesOwed: Expense[];
  createdAt: string;
  balance: number;
}

interface UserWithDebtInfo extends User {
  amount: number;
  owedToMe: boolean;
}

export type User = {
  _id: string;
  name: string;
  email: string;
};

export const usersOptions = () =>
  queryOptions({
    queryKey: ["users"],
    queryFn: () => api.get<UsersResponse>(`/users`).then((res) => res.data),
  });

export const userOptions = () =>
  queryOptions({
    queryKey: ["userInfo"],
    queryFn: () =>
      api.get<UserResponse>(`/users/profile`).then((res) => res.data),
  });

export const updateUser = (name?: string) =>
  api.patch(`/users/profile`, { name }).then((res) => res.data);
