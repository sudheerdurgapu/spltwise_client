import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/custom-button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteItem, itemOptions } from "@/api/item";

const timeFormatter = new Intl.DateTimeFormat("en-us", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const ItemDetail = () => {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const { data } = useQuery(itemOptions(itemId));
  const item = data?.data;

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", item?.expense] });
      router.back();
    },
  });

  return (
    <SafeAreaView className="bg-white h-full px-4 mb-6 space-y-6">
      <ScrollView>
        <FlatList
          data={item?.sharedBy}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View className="items-center py-2 flex-row gap-2">
              {/* avatar  */}
              <View
                className="items-center justify-center w-10 h-10 rounded-full"
                style={{
                  backgroundColor: `hsl(${
                    ((Number(index) - 1) * 137.5) % 360
                  }, 50%, 50%)`,
                }}
              >
                <Text className="font-pregular text-lg text-white uppercase">
                  {item.name
                    .split(" ")
                    .reduce((acc, curr) => (acc += curr[0]), "")}
                </Text>
              </View>
              <Text className="font-pregular text-lg">{item.name}</Text>
            </View>
          )}
          ListHeaderComponent={() =>
            item ? (
              <View className="space-y-6">
                <View className="flex-row justify-between items-center">
                  <View className="gap-4 flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                      <Ionicons name="chevron-back" size={24} />
                    </TouchableOpacity>
                    <Text className="text-2xl font-pbold">Item Details</Text>
                  </View>
                  <Link
                    href={{
                      pathname: "/expense/add-item",
                      params: {
                        itemId: item._id,
                        expenseId: item.expense,
                        purchasedBy: item.purchasedBy._id,
                      },
                    }}
                  >
                    <MaterialIcons name="edit" size={24} />
                  </Link>
                </View>

                {/* header  */}
                <View className="flex-row pb-6 border-b border-black/5">
                  <View className="items-center justify-center w-16 h-16 p-2 rounded-full border border-black/5">
                    <MaterialIcons
                      name="local-grocery-store"
                      size={32}
                      color="#666"
                    />
                  </View>
                  <View className="space-y-2 ml-4">
                    <Text className="font-pregular text-lg">{item.name}</Text>
                    <Text className="font-psemibold text-3xl">
                      ${item.price}
                    </Text>
                    <Text className="font-pregular text-black/50">
                      Paid by {item.purchasedBy.name} on{" "}
                      {timeFormatter.format(new Date(item.createdAt))}
                    </Text>
                  </View>
                </View>

                {/* Item info */}
                <View className="space-y-4">
                  <Text className="text-lg font-psemibold text-black-200">
                    Exempted By
                  </Text>
                  {item.exemptedBy.length ? (
                    <FlatList
                      data={item.exemptedBy}
                      keyExtractor={(item) => item._id}
                      scrollEnabled={false}
                      renderItem={({ item, index }) => (
                        <View className="items-center py-2 flex-row gap-2">
                          {/* avatar  */}
                          <View
                            className="items-center justify-center w-10 h-10 rounded-full"
                            style={{
                              backgroundColor: `hsl(${
                                ((Number(index) - 1) * 137.5) % 360
                              }, 50%, 50%)`,
                            }}
                          >
                            <Text className="font-pregular text-lg text-white uppercase">
                              {item.name
                                .split(" ")
                                .reduce((acc, curr) => (acc += curr[0]), "")}
                            </Text>
                          </View>
                          <Text className="font-pregular text-lg">
                            {item.name}
                          </Text>
                        </View>
                      )}
                    />
                  ) : (
                    <Text className="text-lg font-pregular text-black/50">
                      None
                    </Text>
                  )}
                </View>

                {/* shared users  */}
                <Text className="text-lg font-psemibold text-black-200">
                  Shared By
                </Text>
              </View>
            ) : (
              <></>
            )
          }
          ListEmptyComponent={() => (
            <Text className="text-lg font-pregular text-black/50">None</Text>
          )}
        />
        <CustomButton
          title="Remove Item"
          handlePress={() => {
            deleteMutation.mutate(itemId);
          }}
          containerStyles="mt-7 bg-transparent"
          textStyles="text-red-500"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemDetail;
