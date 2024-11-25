import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import React, { useContext } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Card, { CardLinkWrapper } from "@/components/card";
import CustomButton from "@/components/custom-button";
import FormField from "@/components/form-field";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupsOptions } from "@/api/group";
import { updateUser, UserDetailsWithDebtInfo, userOptions } from "@/api/user";
import AuthContext from "@/context/auth";

const Profile = () => {
  const { logout } = useContext(AuthContext);

  const { data: user, error} = useQuery(userOptions());
  const userInfo = user?.data;

  const { data: groups } = useQuery(groupsOptions());
  const groupsInfo = groups?.data;

  return (
    <SafeAreaView className="h-full px-4 mb-6 space-y-6 bg-white">
      <ScrollView>
        <FlatList
          data={groupsInfo}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <CardLinkWrapper _id={item._id} baseURL="/group">
              <Card
                {...item}
                index={index}
                amount={item.totalOwed ? item.totalOwed : item.totalReturned}
                isGet={item.totalReturned > 0}
              />
            </CardLinkWrapper>
          )}
          ListHeaderComponent={<Header userInfo={userInfo} />}
          ListEmptyComponent={() => (
            <View className="items-center justify-center space-y-6">
              <Text className="text-lg text-center font-pregular mt-7 text-black/30">
                no recent acitvity
              </Text>
            </View>
          )}
        />
        <CustomButton
          title="Logout"
          handlePress={logout}
          containerStyles="bg-transparent"
          textStyles="text-red-500"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const Header = ({ userInfo }: { userInfo?: UserDetailsWithDebtInfo }) => {
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string | undefined>(userInfo?.name);

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      setIsModalVisible(false);
    },
  });

  const handleUpdate = () => {
    if (!name || name !== userInfo?.name) {
      updateMutation.mutate(name);
    }
  };
  
  if (!userInfo) {
    return (
      <Text className="text-base font-pregular text-black/50">Loading...</Text>
    );
  }


  return (
    <View className="w-full space-y-6">
      <Text className="text-2xl font-pbold">Profile</Text>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="items-center justify-center w-12 h-12 bg-orange-500 rounded-full">
            <Text className="text-lg text-white uppercase font-pmedium">
              {userInfo.name
                .split(" ")
                .reduce((acc, curr) => (acc += curr[0]), "")}
            </Text>
          </View>
          <View>
            <Text className="text-xl capitalize font-pmedium">
              {userInfo.name}
            </Text>
            <Text className="font-pregular text-black-200">
              {userInfo.email}
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <MaterialIcons name="edit" size={24} />
          </TouchableOpacity>
          <Modal
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
            animationType="slide"
            presentationStyle="pageSheet"
          >
            <ScrollView>
              <View className="flex-1">
                <View className="flex-row items-center gap-4 p-4">
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <MaterialIcons name="close" size={24} />
                  </TouchableOpacity>
                  <Text className="text-lg font-pmedium">Edit Profile</Text>
                </View>
                <View className="flex-1 px-4">
                  <FormField
                    title="Name"
                    value={name || userInfo?.name}
                    placeholder="Enter name"
                    onChangeText={setName}
                    otherStyles="mt-7"
                  />
                  <CustomButton
                    title="Save"
                    containerStyles="mt-7"
                    handlePress={handleUpdate}
                    isLoading={updateMutation.isPending}
                  />
                </View>
              </View>
            </ScrollView>
          </Modal>
        </View>
      </View>
      <Text className="mb-4 text-lg font-psemibold text-black-200">Groups</Text>
    </View>
  );
};

export default Profile;
