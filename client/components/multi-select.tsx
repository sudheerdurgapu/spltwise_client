import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import CustomButton from "./custom-button";

const MultiSelect = ({
  title,
  placeholder,
  selected,
  options,
  handlePress,
  containerStyles,
  createNewLink,
  error,
}: {
  title?: string;
  placeholder: string;
  selected: string[];
  options: {
    label: string;
    value: string;
  }[];
  handlePress: (value: string) => void;
  containerStyles?: string;
  createNewLink?: string;
  error?: string;
}) => {
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);

  const handleSelect = (value: string) => {
    handlePress(value);
  };

  const selectedOptions = options.filter((option) =>
    selected.includes(option.value)
  );

  return (
    <View className={`space-y-1 ${containerStyles}`}>
      {title ? (
        <Text className="text-base text-black-100 font-pmedium">{title}</Text>
      ) : null}
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <View className="w-full h-16 px-4 bg-white rounded-2xl border-2 border-black/5 focus:border-primary flex-1 flex-row justify-between items-center">
          {selectedOptions.length ? (
            <View className="flex-row items-center gap-2">
              <View className="p-1 bg-black/5 rounded-md flex-row items-center gap-1 justify-center">
                <Text className="font-pregular text-sm">
                  {selectedOptions[0].label}
                </Text>
                <TouchableOpacity
                  onPress={() => handleSelect(selectedOptions[0].value)}
                >
                  <MaterialIcons name="close" size={16} />
                </TouchableOpacity>
              </View>
              {selectedOptions.length - 1 ? (
                <View className="p-1 bg-black/5 rounded-md flex-row items-center gap-1 justify-center">
                  <Text className="font-pregular text-sm">
                    +{selectedOptions.length - 1} more
                  </Text>
                </View>
              ) : null}
            </View>
          ) : (
            <Text className="font-pregular text-base text-[#aaa]">
              {placeholder}
            </Text>
          )}

          <Ionicons name="chevron-down" size={24} color="#aaa" />
        </View>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1">
          <View className="p-4 flex-row items-center justify-between mb-7">
            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialIcons name="close" size={24} />
              </TouchableOpacity>
              <Text className="font-pmedium text-base">Please select</Text>
            </View>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text className="font-pmedium text-base text-blue-500">Done</Text>
            </TouchableOpacity>
          </View>
          {options.length ? (
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item.value)}>
                  <View className="flex-row justify-between items-center p-4 border-b border-black/5">
                    <Text
                      className={`text-base ${
                        selected.includes(item.value)
                          ? "font-pmedium"
                          : "font-pregular"
                      }`}
                    >
                      {item.label}
                    </Text>
                    {selected.includes(item.value) ? (
                      <MaterialIcons name="check" size={24} />
                    ) : null}
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <>
              <Text className="font-pregular text-center text-lg mt-7 text-black/30">
                No Options Available
              </Text>
              {createNewLink ? (
                <CustomButton
                  title="Create New"
                  handlePress={() => {
                    setIsModalVisible(false);
                    router.push("/groups");
                  }}
                  containerStyles="mt-7 mx-4"
                />
              ) : null}
            </>
          )}
        </View>
      </Modal>
      {error ? (
        <Text className="text-base text-red-500 font-pregular">{error}</Text>
      ) : null}
    </View>
  );
};

export default MultiSelect;
