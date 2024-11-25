import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export const CardLinkWrapper = ({
  _id,
  baseURL,
  children,
}: {
  _id: string;
  baseURL: string;
  children: React.ReactNode;
}) => (
  <TouchableOpacity
    className="w-full"
    onPress={() => router.push(`${baseURL}/${_id}`)}
  >
    {children}
  </TouchableOpacity>
);

const Card = ({
  _id,
  index,
  name,
  isGet,
  amount,
}: {
  _id: string;
  index: number;
  name: string;
  isGet: boolean;
  amount: number;
}) => {
  return (
    <View className="w-full items-center flex-row justify-between py-2">
      <View className="items-center justify-center flex-row gap-2">
        <View
          className="items-center justify-center w-10 h-10 rounded-full"
          style={{
            backgroundColor: `hsl(${
              ((Number(index) - 1) * 137.5) % 360
            }, 50%, 50%)`,
          }}
        >
          <Text className="font-pregular text-lg text-white uppercase">
            {name?.split(" ").reduce((acc, curr) => (acc += curr[0]), "")}
          </Text>
        </View>
        <Text className="font-pregular text-lg">{name}</Text>
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
  );
};

export default Card;
