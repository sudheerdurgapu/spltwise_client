import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  ListRenderItemInfo,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Card, { CardLinkWrapper } from "@/components/card";
import React from "react";
import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGroup, groupsOptions, GroupWithBalance } from "@/api/group";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const Groups = () => {
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);

  const { data } = useQuery(groupsOptions());
  const groupsData = data?.data;

  const toggleModal = (value: boolean) => {
    setIsModalVisible(value);
  };

  const renderItem = React.useCallback(
    ({ item, index }: ListRenderItemInfo<GroupWithBalance>) => {
      const totalAmount = item.totalReturned - item.totalOwed;
      return(
        <CardLinkWrapper _id={item._id} baseURL="/groups">
          <Card
            {...item}
            index={index}
            amount={totalAmount < 0 ? -totalAmount : totalAmount}
            isGet={totalAmount > 0}
          />
        </CardLinkWrapper>
      )
    },
    []
  );

  return (
    <SafeAreaView className="h-full px-4 mb-6 space-y-6 bg-white">
      <FlatList
        data={groupsData}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={
          <Header isModalVisible={isModalVisible} toggleModal={toggleModal} />
        }
        ListEmptyComponent={() => (
          <View className="items-center justify-center flex-1 h-full space-y-6">
            <Text className="text-lg text-center font-pregular mt-7 text-black/30">
              No Groups Available
            </Text>
            <CustomButton
              title="Create New"
              handlePress={() => toggleModal(true)}
              containerStyles="mt-7 w-full"
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const Header = ({
  isModalVisible,
  toggleModal,
}: {
  isModalVisible: boolean;
  toggleModal: (value: boolean) => void;
}) => {
  const [name, setName] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createGroup,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toggleModal(false);
      setName("");
      router.push({
        pathname: "/groups/[id]",
        params: {
          id: data.data._id,
        },
      });
    },
  });

  const validate = (value: string) => {
    let valid = true;
    if (!value) {
      setError("Group name is required");
      valid = false;
    } else {
      setError("");
    }

    return valid;
  };

  const handleChange = (e: string) => {
    setName(e);
    validate(e);
  };

  const handleSaveGroup = () => {
    if (!validate(name)) return;
    mutate(name);
  };
  return (
    <View className="flex-row items-center justify-between mb-6">
      <Text className="text-2xl font-pbold">Groups</Text>
      <TouchableOpacity
        onPress={() => {
          toggleModal(true);
        }}
      >
        <MaterialIcons name="add" size={32} color="#000" />
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        onRequestClose={() => toggleModal(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ScrollView>
          <View className="flex-row items-center gap-4 p-4">
            <TouchableOpacity onPress={() => toggleModal(false)}>
              <MaterialIcons name="close" size={24} />
            </TouchableOpacity>
            <Text className="text-lg font-pmedium">Add Group</Text>
          </View>
          <View className="flex-1 w-full h-full px-4 my-4">
            <FormField
              title="Name"
              value={name.toString()}
              placeholder="Enter name"
              onChangeText={handleChange}
              otherStyles="mt-0"
              error={error}
            />
            <CustomButton
              title="Save"
              handlePress={handleSaveGroup}
              containerStyles="mt-7"
              isLoading={isPending}
            />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default Groups;
