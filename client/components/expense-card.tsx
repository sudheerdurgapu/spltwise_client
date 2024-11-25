import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

const ExpenseCard = ({
  _id,
  index,
  name,
  amount,
  isGet,
  paidBy,
  baseURL,
}: {
  _id: string;
  index: number;
  name: string;
  amount: number;
  isGet: boolean;
  paidBy: string;
  baseURL: string;
}) => {
  return (
    <TouchableOpacity
      className="w-full"
      onPress={() => router.push(`${baseURL}/${_id}`)}
    >
      <View className="w-full items-center flex-row justify-between py-2">
        {/* avatar  */}
        <View className="items-center justify-center flex-row gap-2">
          <View
            className="items-center justify-center w-12 h-12 rounded-full"
            style={{
              backgroundColor: `hsl(${
                ((Number(index) - 1) * 137.5) % 360
              }, 50%, 50%)`,
            }}
          >
            <Text className="font-pregular text-lg text-white uppercase">
              {name.split(" ").reduce((acc, curr) => (acc += curr[0]), "")}
            </Text>
          </View>
          <View>
            <Text className="font-pregular text-lg">{name}</Text>
            <Text className="font-pregular text-black/50">
              Paid by - {paidBy}
            </Text>
          </View>
        </View>
        {amount ? (
          <View className="items-end">
            <Text
              className={`text-sm ${
                isGet ? "text-green-500" : "text-orange-500"
              }`}
            >
              you {isGet ? "get" : "owe"}
            </Text>
            <Text
              className={`font-pmedium text-lg ${
                isGet ? "text-green-500" : "text-orange-500"
              }`}
            >
              ${amount.toFixed(2)}
            </Text>
          </View>
        ) : (
          <Text className="font-pmedium text-black/50">Settled Up</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ExpenseCard;
