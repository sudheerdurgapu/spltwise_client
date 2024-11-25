import { queryOptions } from "@tanstack/react-query";
import api, { BaseResponse } from ".";
import { User } from "./user";
import { AddItem } from "./expense";

interface ItemResponse extends BaseResponse<ItemWithPursharedInfo> {}

interface ItemWithPursharedInfo extends Omit<Item, "purchasedBy"> {
  purchasedBy: User;
}

export type Item = {
  _id: string;
  name: string;
  price: number;
  purchasedBy: string;
  sharedBy: User[];
  exemptedBy: User[];
  expense: string;
  createdAt: string;
};

interface EditItem extends AddItem {
  _id: string;
}

export const itemOptions = (id: string) =>
  queryOptions({
    queryKey: ["items", id],
    queryFn: () =>
      api.get<ItemResponse>(`/items/${id}`).then((res) => res.data),
  });

export const updateItem = (data: EditItem) =>
  api.patch(`/items/${data._id}`, data);

export const deleteItem = (id: string) => api.delete(`/items/${id}`);
