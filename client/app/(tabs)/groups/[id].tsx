import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "@/components/custom-button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteGroup, groupOptions, type Group } from "@/api/group";
import ExpenseCard from "@/components/expense-card";

const GroupDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data } = useQuery(groupOptions(id));
  const groupInfo = data?.data;

  return (
    <SafeAreaView className="h-full px-4 mb-6 space-y-6 bg-white">
      <FlatList
        data={groupInfo?.expenses}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <ExpenseCard
            _id={item._id}
            baseURL="/expense"
            name={item.description}
            paidBy={item.paidBy.name}
            index={index}
            amount={item.totalOwed ? item.totalOwed : item.totalReturned}
            isGet={item.totalReturned > 0}
          />
        )}
        ListHeaderComponent={<Header group={groupInfo} />}
        ListEmptyComponent={() => (
          <Text className="mt-6 text-lg font-pregular text-black/50">
            No expenses available
          </Text>
        )}
      />
    </SafeAreaView>
  );
};

const Header = ({ group }: { group: Group | undefined }) => {
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);

  const totalAmount = group?.expenses?.reduce(
    (total, expense) =>
      (total += expense.totalOwed ? -expense.totalOwed : expense.totalReturned),
    0
  );

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      setIsModalVisible(false);
      router.back();
    },
  });

  if (!group) {
    return (
      <Text className="text-base font-pregular text-black/50">Loading...</Text>
    );
  }

  return (
    <View className="space-y-6">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-pbold">{group.name}</Text>
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
              data={group.members}
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
                      {item.name
                        .split(" ")
                        .reduce((acc, curr) => (acc += curr[0]), "")}
                    </Text>
                  </View>
                  <Text className="text-lg font-pregular">{item.name}</Text>
                </View>
              )}
              ListHeaderComponent={() => (
                <>
                  <View className="flex-row items-center gap-4 p-4 px-0 mb-6">
                    <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                      <MaterialIcons name="close" size={24} />
                    </TouchableOpacity>
                    <Text className="text-lg font-pmedium">Group Info</Text>
                  </View>
                  <Text className="text-lg font-psemibold text-black-200">
                    Members
                  </Text>
                </>
              )}
              ListEmptyComponent={() => (
                <Text className="text-lg text-black/50 font-pregular">
                  No members
                </Text>
              )}
            />
            <View className="space-y-2 mt-7">
              <Text className="text-lg font-psemibold text-black-200">
                Actions
              </Text>
              <CustomButton
                title="Delete Group"
                handlePress={() => {
                  deleteMutation.mutate(group._id);
                }}
                containerStyles="bg-transparent justify-start"
                textStyles="text-red-500"
              />
            </View>
          </ScrollView>
        </Modal>
      </View>
      {totalAmount ? (
        <View className="flex-row items-center gap-2">
          <Text
            className={`text-xl font-pregular ${
              totalAmount > 0 ? "text-green-500" : "text-orange-500"
            }`}
          >
            you {totalAmount > 0 ? "get" : "owe"}
          </Text>
          <Text
            className={`font-pmedium text-xl ${
              totalAmount > 0 ? "text-green-500" : "text-orange-500"
            }`}
          >
            ${(totalAmount > 0 ? totalAmount : -totalAmount).toFixed(2)}
          </Text>
        </View>
      ) : null}
      <View className="flex-row items-center justify-center">
        <CustomButton
          title="Add Expense"
          handlePress={() => router.push(`/create?groupId=${group._id}`)}
          containerStyles="flex-1 min-h-[50px] mr-4"
        />
        <CustomButton
          title="Add Members"
          handlePress={() =>
            router.push(`/groups/add-member?groupId=${group._id}`)
          }
          containerStyles="bg-black/10 flex-1 min-h-[50px]"
          textStyles="text-black"
        />
      </View>
      {group.expenses.length ? (
        <Text className="mb-4 text-lg font-psemibold text-black-200">
          Expenses
        </Text>
      ) : null}
    </View>
  );
};

export default GroupDetail;
