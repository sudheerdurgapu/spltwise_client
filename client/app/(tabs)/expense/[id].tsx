import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  Alert,
} from "react-native";
import React from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "@/components/custom-button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteExpense,
  expenseOptions,
  ExpenseWithItem,
  finalizeExpense,
} from "@/api/expense";

const timeFormatter = new Intl.DateTimeFormat("en-us", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const ExpenseDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const { data } = useQuery(expenseOptions(id));
  const expense = data?.data;

  return (
    <SafeAreaView className="h-full px-4 mb-6 space-y-6 bg-white">
      <ScrollView>
        <FlatList
          data={expense?.items}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/expense/item",
                  params: {
                    itemId: item._id,
                  },
                })
              }
              className="w-full"
            >
              <View className="flex-row items-center justify-between w-full py-2">
                <View className="flex-row items-center justify-center gap-2">
                  <View
                    className="items-center justify-center w-12 h-12 rounded-full"
                    style={{
                      backgroundColor: `hsl(${
                        ((Number(index) - 1) * 137.5) % 360
                      }, 50%, 50%)`,
                    }}
                  >
                    <Text className="text-lg text-white uppercase font-pregular">
                      {item.name
                        .split(" ")
                        .reduce((acc, curr) => (acc += curr[0]), "")}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-lg font-pregular">{item.name}</Text>
                    {item.exemptedBy.length ? (
                      <View className="flex-row items-center gap-2">
                        <Text className="font-pregular">Exempted By :</Text>
                        <Text className="truncate font-pregular">
                          {item.exemptedBy[0].name.split(" ")[0]}
                          {item.exemptedBy.length - 1 > 0
                            ? `, +${item.exemptedBy.length - 1} more`
                            : ""}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <Text className="text-lg text-green-500 font-pmedium whitespace-nowrap">
                  ${item.price}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListHeaderComponent={<Header expense={expense} />}
          ListEmptyComponent={() => (
            <Text className="text-base text-center font-pregular text-black/50 pt-7">
              No Items
            </Text>
          )}
        />
        <View className="mt-6 space-y-4">
          <Text className="text-lg font-psemibold text-black-200">Image</Text>
          {expense?.image ? (
            <View className="items-center w-full aspect-square">
              <Image
                source={{
                  uri: `${apiUrl}${expense.image}`,
                }}
                className="w-full h-full"
              />
            </View>
          ) : (
            <Text className="text-base text-center font-pregular text-black/50 pt-7">
              No image attached to the expense
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Header = ({ expense }: { expense?: ExpenseWithItem }) => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      queryClient.invalidateQueries({ queryKey: ["groups", expense?.group] });
      setIsModalVisible(false);
      router.back();
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: finalizeExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      Alert.alert("Success", "We finalized expense by splitting the amount");
    }
  });
  if (!expense) {
    return (
      <Text className="text-base font-pregular text-black/50">Loading...</Text>
    );
  }
  return (
    <>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-pbold">Expense Details</Text>
        </View>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <MaterialIcons name="info-outline" size={24} />
        </TouchableOpacity>
        <Modal
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <ScrollView className="px-4 my-4">
            <FlatList
              data={expense.sharedWith}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View className="flex-row items-center w-full gap-2 py-2">
                  <View
                    className="items-center justify-center w-10 h-10 rounded-full"
                    style={{
                      backgroundColor: `hsl(${
                        ((Number(index) - 1) * 137.5) % 360
                      }, 50%, 50%)`,
                    }}
                  >
                    <Text className="text-lg text-white uppercase font-pregular">
                      {item.user.name
                        .split(" ")
                        .reduce((acc, curr) => (acc += curr[0]), "")}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-lg font-pregular">
                      {item.user.name}
                    </Text>
                    <Text className="font-pregular text-black/50">
                      Shared Amount : ${item.shareAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}
              ListHeaderComponent={() => (
                <>
                  <View className="flex-row items-center gap-4 p-4 px-0 mb-6">
                    <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                      <MaterialIcons name="close" size={24} />
                    </TouchableOpacity>
                    <Text className="text-lg font-pmedium">Expense Info</Text>
                  </View>
                  <Text className="text-lg font-psemibold text-black-200">
                    Participants
                  </Text>
                </>
              )}
              ListEmptyComponent={() => (
                <Text className="text-base text-center font-pregular text-black/50 pt-7">
                  No participants
                </Text>
              )}
            />
            <View className="mt-6 space-y-2">
              <Text className="text-lg font-psemibold text-black-200">
                Actions
              </Text>
              <View className="flex-row items-center justify-between gap-4 px-4 mt-7">
                <CustomButton
                  title="Edit Expense"
                  handlePress={() => {
                    setIsModalVisible(false);
                    router.push({
                      pathname: "/create",
                      params: {
                        groupId: expense.group,
                        expenseId: expense._id,
                      },
                    });
                  }}
                  containerStyles="bg-transparent flex-1"
                  textStyles="text-blue-500"
                />
                <CustomButton
                  title="Delete Expense"
                  handlePress={() => {
                    deleteMutation.mutate(id);
                  }}
                  containerStyles="bg-transparent flex-1 ml-4"
                  textStyles="text-red-500"
                />
              </View>
            </View>
          </ScrollView>
        </Modal>
      </View>
      <View className="pb-6 mt-6 border-b border-black/5">
        <View className="flex-row">
          <View className="items-center justify-center w-16 h-16 p-2 border rounded-full border-black/5">
            <MaterialIcons name="money" size={32} color="#666" />
          </View>
          <View className="ml-4 space-y-2">
            <Text className="text-lg font-pregular">{expense.description}</Text>
            <Text className="text-3xl font-psemibold">
              ${expense.totalAmount}
            </Text>
            <Text className="font-pregular text-black/50">
              Paid by {expense.paidBy.name} on{" "}
              {timeFormatter.format(new Date(expense.date))}
            </Text>
          </View>
        </View>
        <CustomButton
          title="Finalize Expense"
          handlePress={() => {
            finalizeMutation.mutate(expense._id);
          }}
          isLoading={finalizeMutation.isPending}
          containerStyles="mt-6"
        />
      </View>
      <View className="flex-row items-center justify-between mt-6">
        <Text className="text-lg font-psemibold text-black-200">Items</Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/expense/add-item",
              params: {
                expenseId: expense._id,
                purchasedBy: expense.paidBy._id,
              },
            })
          }
        >
          <MaterialIcons name="add" size={24} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ExpenseDetail;
