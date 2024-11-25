import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/custom-button";
import Dropdown from "@/components/dropdown";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addUsertoGroup, groupOptions } from "@/api/group";
import { usersOptions } from "@/api/user";

const AddMember = () => {
  const [user, setUser] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const queryClient = useQueryClient();
  const { data } = useQuery(groupOptions(groupId));
  const group = data?.data;

  const { data: users } = useQuery(usersOptions());
  const usersData = users?.data.filter(
    (user) => !group?.members.find((member) => member._id === user._id)
  );

  const validate = (value: string) => {
    let valid = true;
    if (!value) {
      setError("Please select a user");
      valid = false;
    } else {
      setError("");
    }

    return valid;
  };

  const handleUser = (value: string) => {
    setUser(value);
    validate(value);
  };

  const addUserMutation = useMutation({
    mutationFn: addUsertoGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", group?._id] }),
        setUser("");
      router.back();
    },
  });

  const handleAddMember = () => {
    if (!validate(user)) return;
    addUserMutation.mutate({ groupId: groupId, userId: user });
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="h-full w-full px-4 my-6">
          <View className="gap-4 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
            <Text className="text-2xl font-pbold">Add Member</Text>
          </View>
          <View className="mt-7 space-y-1">
            <Text className="text-base text-black-100 font-pmedium">Group</Text>
            <View className="w-full h-16 px-4 bg-black/5 rounded-2xl border-2 border-black/5 flex-row items-center">
              <Text className="font-pregular text-black/50">{group?.name}</Text>
            </View>
          </View>
          <View className="flex-1">
            {usersData ? (
              <Dropdown
                title="User"
                placeholder="Select User"
                options={usersData.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                selected={user}
                handlePress={handleUser}
                containerStyles="mt-7"
                error={error}
              />
            ) : null}
            <CustomButton
              title="Add Now"
              handlePress={handleAddMember}
              containerStyles="mt-7"
              isLoading={addUserMutation.isPending}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddMember;
