import { View, Text, FlatList } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Card, { CardLinkWrapper } from "@/components/card";
import { Link, router } from "expo-router";
import CustomButton from "@/components/custom-button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { expensesOptions } from "@/api/expense";

const Expenses = () => {
  const { data } = useQuery(expensesOptions());
  const expenseInfo = data?.data;

  return (
    <SafeAreaView className="h-full px-4 mb-6 space-y-6 bg-white">
      <FlatList
        data={expenseInfo}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <CardLinkWrapper _id={item._id} baseURL="/expense">
            <Card
              _id={item._id}
              name={item.description}
              index={index}
              amount={item.totalOwed ? item.totalOwed : item.totalReturned}
              isGet={item.totalReturned > 0}
            />
          </CardLinkWrapper>
        )}
        ListHeaderComponent={() =>
          expenseInfo ? (
            <View
              className={`flex-row items-center mb-6 ${
                expenseInfo?.length ? "justify-between" : "justify-start"
              }`}
            >
              <Text className="text-2xl font-pbold">Expenses</Text>
              {expenseInfo?.length ? (
                <Link href="/create">
                  <MaterialIcons name="add" size={32} color="#000" />
                </Link>
              ) : null}
            </View>
          ) : (
            <Text className="text-base font-pregular text-black/50">
              Loading...
            </Text>
          )
        }
        ListEmptyComponent={() => (
          <View className="items-center justify-center flex-1 h-full space-y-6">
            <Text className="text-lg text-center font-pregular mt-7 text-black/30">
              no expense recorded
            </Text>
            <CustomButton
              title="Add Expense"
              handlePress={() => router.push("/create")}
              containerStyles="mt-7 w-full"
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Expenses;
