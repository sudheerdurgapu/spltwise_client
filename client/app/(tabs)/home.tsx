import { View, Text, ScrollView, FlatList } from "react-native";
import React from "react";
import Card from "@/components/card";
import CustomButton from "@/components/custom-button";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { userOptions } from "@/api/user";

const Home = () => {
  const { data } = useQuery(userOptions());
  const user = data?.data;

  return (
    <SafeAreaView className="h-full px-4 mb-6 space-y-6 bg-white">
      <FlatList
        data={user?.users}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <Card {...item} index={index} isGet={item.owedToMe} />
        )}
        ListHeaderComponent={() => (
          <View className="w-full space-y-6">
            <Text className="text-2xl font-pbold">Balances</Text>
            {!user ? (
              <Text className="text-base font-pregular text-black/50">
                Loading...
              </Text>
            ) : (
              <View className="space-y-6">
                <View className="flex-1 p-4 space-y-2 bg-primary rounded-2xl">
                  <Text className="text-lg font-pregular text-white/80">
                    You {user.balance < 0 ? "Get" : "Owe"}
                  </Text>
                  <Text className="text-4xl text-white font-pbold">
                    $
                    {(user.balance < 0 ? -user.balance : user.balance).toFixed(
                      2
                    )}
                  </Text>
                </View>
                <Text className="text-lg font-psemibold text-black-200">
                  Recent Info
                </Text>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center flex-1 h-full space-y-6">
            <Text className="text-lg text-center font-pregular mt-7 text-black/30">
              No acitvity
            </Text>
            <CustomButton
              title="Add Expense"
              handlePress={() => router.push("/expense")}
              containerStyles="mt-7 w-full"
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
