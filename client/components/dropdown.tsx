import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import CustomButton from "./custom-button";

const Dropdown = ({
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
  selected: string;
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
    setIsModalVisible(false);
  };

  const selectedOption = options.find((option) => option.value === selected);

  return (
    <View className={`space-y-1 ${containerStyles}`}>
      {title ? (
        <Text className="text-base text-black-100 font-pmedium">{title}</Text>
      ) : null}
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <View className="w-full h-16 px-4 bg-white rounded-2xl border-2 border-black/5 focus:border-primary flex-1 flex-row justify-between items-center">
          <Text
            className={`font-pregular text-base ${
              selectedOption ? "text-black" : "text-[#aaa]"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
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
          <View className="p-4 flex-row gap-4 items-center mb-7">
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <MaterialIcons name="close" size={24} />
            </TouchableOpacity>
            <Text className="font-pmedium text-base">Please select</Text>
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
                        selected === item.value
                          ? "font-pmedium"
                          : "font-pregular"
                      }`}
                    >
                      {item.label}
                    </Text>
                    {selected === item.value ? (
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

export default Dropdown;
