import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import FormField from "@/components/form-field";
import Dropdown from "@/components/dropdown";
import CustomButton from "@/components/custom-button";
import { router, useLocalSearchParams } from "expo-router";
import MultiSelect from "@/components/multi-select";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addItemtoExpense, expensesOptions } from "@/api/expense";
import { AddItem as Form } from "@/api/expense";
import { usersOptions } from "@/api/user";
import { itemOptions, updateItem } from "@/api/item";
import { groupsOptions } from "@/api/group";

type Errors = {
  [k in keyof Form]: string;
};

const AddItem = () => {
  const {
    expenseId,
    purchasedBy,
    itemId = "",
  } = useLocalSearchParams<{
    expenseId: string;
    purchasedBy: string;
    itemId?: string;
  }>();

  const { data: item } = useQuery({
    ...itemOptions(itemId),
    enabled: !!itemId,
  });
  const itemInfo = item?.data;

  const [form, setForm] = React.useState<Form>({
    name: itemInfo?.name || "",
    price: itemInfo?.price || undefined,
    purchasedBy,
    expenseId: expenseId,
    sharedBy: itemInfo?.sharedBy.map((item) => item._id) || [],
    exemptedBy: itemInfo?.exemptedBy.map((item) => item._id) || [],
  });

  const [errors, setErrors] = React.useState<Errors>({} as Errors);

  const queryClient = useQueryClient();
  const { data } = useQuery(expensesOptions());
  const expenses = data?.data;

  const { data: groups } = useQuery(groupsOptions());

  const users = groups?.data
    ?.find((group) =>
      group.expenses.find((expense) => expense._id === form.expenseId)
    )
    ?.members.map((member) => ({ label: member.name, value: member._id }));

  const addItemMutation = useMutation({
    mutationFn: addItemtoExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", expenseId],
      });
      router.back();
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", expenseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["items", itemId],
      });
      router.back();
    },
  });

  const handleMultiSelect = (
    name: "sharedBy" | "exemptedBy",
    value: string
  ) => {
    const currentValue = form[name];
    let finalValue: string[];

    if (currentValue.includes(value)) {
      finalValue = currentValue.filter((item) => item !== value);
    } else {
      finalValue = [...currentValue, value];
    }

    setForm({ ...form, [name]: finalValue });
  };

  const validate = (): boolean => {
    const newErrors: Errors = {} as Errors;

    if (!form.name) {
      newErrors.name = "Name is required";
    }
    if ((form?.price ?? 0) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!form.expenseId) {
      newErrors.expenseId = "Please select an expense";
    }
    if (form.sharedBy.length === 0) {
      newErrors.sharedBy = "Please select at least one member";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    const isValid = validate();

    if (isValid) {
      itemId
        ? updateItemMutation.mutate({ ...form, _id: itemId })
        : addItemMutation.mutate(form);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="h-full w-full px-4 my-6">
          <View className="gap-4 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
            <Text className="text-2xl font-pbold">
              {itemId ? "Edit Item" : "Add Item"}
            </Text>
          </View>
          <View className="flex-1 h-full">
            <Dropdown
              title="Expense"
              placeholder="Select Expense"
              options={
                expenses?.map((expense) => ({
                  label: expense.description,
                  value: expense._id,
                })) ?? []
              }
              selected={form.expenseId}
              handlePress={(value) => {
                setForm({ ...form, expenseId: value });
              }}
              containerStyles="mt-7"
              error={errors.expenseId}
            />
            <FormField
              title="Name"
              value={form?.name}
              placeholder="Enter Name"
              onChangeText={(e) => setForm({ ...form, name: e })}
              otherStyles="mt-7"
              error={errors.name}
            />
            <FormField
              title="Price"
              value={form?.price?.toString() ?? ""}
              placeholder="Enter Price"
              onChangeText={(e) => setForm({ ...form, price: Number(e) })}
              keyboardType="number-pad"
              otherStyles="mt-7"
              error={errors.price}
            />
            <MultiSelect
              title="Shared By"
              placeholder="Select Member"
              options={users ?? []}
              selected={form.sharedBy}
              handlePress={(value) => handleMultiSelect("sharedBy", value)}
              containerStyles="mt-7"
              createNewLink="/groups"
              error={errors.sharedBy}
            />
            <MultiSelect
              title="Exempted By"
              placeholder="Select Member"
              options={users ?? []}
              selected={form.exemptedBy}
              handlePress={(value) => handleMultiSelect("exemptedBy", value)}
              containerStyles="mt-7"
              createNewLink="/groups"
              error={errors.exemptedBy}
            />
            <CustomButton
              title="Save"
              handlePress={handleSubmit}
              containerStyles="mt-7"
              isLoading={
                addItemMutation.isPending || updateItemMutation.isPending
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddItem;
