import { QueryClient, queryOptions, useMutation } from "@tanstack/react-query";
import api, { BaseResponse } from ".";
import { Expense } from "./expense";

interface GroupResponse extends BaseResponse<Group> {}
interface GroupsResponse extends BaseResponse<GroupWithBalance[]> {}

export interface GroupWithBalance extends Group {
  totalOwed: number;
  totalReturned: number;
}

export interface Group {
  _id: string;
  name: string;
  members: Member[];
  createdAt: string;
  expenses: Expense[];
}

interface Member {
  _id: string;
  name: string;
  email: string;
  expensesPaid: string[];
  expensesOwed: string[];
  createdAt: string;
  balance: number;
}

export const groupsOptions = () =>
  queryOptions({
    queryKey: ["groups"],
    queryFn: () => api.get<GroupsResponse>(`/groups`).then((res) => res.data),
  });

export const groupOptions = (id: string) =>
  queryOptions({
    queryKey: ["groups", id],
    queryFn: () =>
      api.get<GroupResponse>(`/groups/${id}`).then((res) => res.data),
  });

export const createGroup = (name: string) =>
  api.post<GroupResponse>("/groups", { name }).then((res) => res.data);
export const deleteGroup = (id: string) => api.delete(`/groups/${id}`);
export const addUsertoGroup = (data: { groupId: string; userId: string }) =>
  api.post(`/groups/add-user`, data);
