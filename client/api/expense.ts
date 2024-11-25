import { queryOptions } from "@tanstack/react-query";
import api, { BaseResponse } from ".";
import { Item } from "./item";
import { User } from "./user";

interface ExpenseResponse extends BaseResponse<ExpenseWithItem> {}
interface ExpensesResponse extends BaseResponse<Expense[]> {}

export interface ExpenseWithItem extends Expense {
  items: Item[];
}

export interface Expense {
  _id: string;
  description: string;
  totalAmount: number;
  paidBy: User;
  sharedWith: SharedWith[];
  totalOwed: number;
  totalReturned: number;
  group: string;
  image: string;
  date: string;
}

interface SharedWith {
  _id: string;
  user: User;
  shareAmount: number;
  exemptedItems: string[];
}

export type AddItem = {
  name: string;
  price?: number;
  expenseId: string;
  purchasedBy: string;
  sharedBy: string[];
  exemptedBy: string[];
};

export const expensesOptions = () =>
  queryOptions({
    queryKey: ["expenses"],
    queryFn: () =>
      api.get<ExpensesResponse>(`/expenses`).then((res) => res.data),
  });

export const expenseOptions = (id: string) =>
  queryOptions({
    queryKey: ["expenses", id],
    queryFn: () =>
      api.get<ExpenseResponse>(`/expenses/${id}`).then((res) => res.data),
  });

export const addItemtoExpense = (data: AddItem) =>
  api.post(`/expenses/${data.expenseId}/items`, data);

export const deleteExpense = (id: string) => api.delete(`/expenses/${id}`);

export const createExpense = (data: FormData) =>
  api.post("/expenses", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateExpense = ({ id, data }: { id: string; data: FormData }) =>
  api.patch(`/expenses/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const finalizeExpense = (id: string) =>
  api.post("/expenses/finalize", { expenseId: id });
