import {
  View,
  Text,
  ScrollView,
  Image,
  Button,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import FormField from "@/components/form-field";
import Dropdown from "@/components/dropdown";
import CustomButton from "@/components/custom-button";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createExpense, expenseOptions, updateExpense } from "@/api/expense";
import { groupsOptions } from "@/api/group";
import { User } from "@/api/user";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AxiosError } from "axios";

type CreateExpense = {
  description: string;
  totalAmount: number;
  groupId: string;
  paidBy: string;
  image: ImagePicker.ImagePickerAsset | null;
};

type FormErrors = {
  [k in keyof CreateExpense]: string;
};

const Create = () => {
  const { groupId, expenseId = "" } = useLocalSearchParams<{
    groupId: string;
    expenseId?: string;
  }>();

  const { data: expense } = useQuery(expenseOptions(expenseId));
  const expenseData = expense?.data;

  const [form, setForm] = useState<CreateExpense>({
    description: expenseData?.description || "",
    totalAmount: expenseData?.totalAmount || 0,
    groupId: groupId ?? "",
    paidBy: expenseData?.paidBy?._id || "",
    image: null,
  });

  const [errors, setErrors] = useState<FormErrors>({} as FormErrors);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const queryClient = useQueryClient();
  const { data } = useQuery(groupsOptions());
  const groups = data?.data;
  const users = groups
    ?.flatMap((group) => group.members)
    .reduce((acc, curr) => {
      if (!acc.find((item) => item._id === curr._id)) {
        acc.push(curr);
      }
      return acc;
    }, [] as User[]);

  // Function to handle image picking
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const fileSize = result.assets?.[0].fileSize ?? 0;
      if (fileSize > 5000000) {
        return Alert.alert("Error", "Image size must be less than 5MB!");
      }

      setForm({ ...form, image: result.assets[0] }); // Set the selected image URI in form state
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {} as FormErrors;

    if (!form.description) {
      newErrors.description = "Description is required";
    }

    if (form.totalAmount <= 0) {
      newErrors.totalAmount = "Amount must be greater than 0";
    }

    if (!form.paidBy) {
      newErrors.paidBy = "Please select who paid";
    }

    if (!form.groupId) {
      newErrors.groupId = "Please select a group";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["groups"] });
    queryClient.invalidateQueries({ queryKey: ["groups", groupId] });
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    queryClient.invalidateQueries({ queryKey: ["userInfo"] });

    Alert.alert(
      "Success",
      `Expense ${expense?.data._id ? "updated" : "created"} successfully!`
    );

    // Optionally, reset the form here or navigate back
    setForm({
      description: "",
      totalAmount: 0,
      groupId: groupId ?? "",
      paidBy: "",
      image: null,
    });
    router.push({
      pathname: "/groups/[id]",
      params: {
        id: groupId,
      },
    });
  };

  const onError = (error: AxiosError) => {
    console.log({ error });
    Alert.alert("Error", "An unexpected error occurred");
  };

  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess,
    onError,
  });

  const uppdateMutation = useMutation({
    mutationFn: updateExpense,
    onSuccess,
    onError,
  });

  // Handle form submission
  const handleSubmit = () => {
    const isValid = validateForm();

    if (isValid) {
      const formData = new FormData();
      formData.append("description", form.description);
      formData.append("totalAmount", form.totalAmount.toString());
      formData.append("groupId", form.groupId);
      formData.append("paidBy", form.paidBy);

      // Only append image if it's selected
      if (form.image) {
        formData.append("image", {
          name: form.image.fileName,
          type: form.image.type,
          uri:
            Platform.OS === "android"
              ? form.image.uri
              : form.image.uri.replace("file://", ""),
        } as any);
      }

      // Call the mutation
      if (expense?.data._id) {
        uppdateMutation.mutate({ id: expense.data._id, data: formData });
      } else {
        createMutation.mutate(formData);
      }
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView>
        <View className="flex-1 w-full h-full px-4 my-6">
          <Text className="text-2xl font-pbold">Add Expense</Text>
          <FormField
            title="Description"
            value={form?.description}
            placeholder="Enter Description"
            onChangeText={(e) => setForm({ ...form, description: e })}
            otherStyles="mt-7"
            error={errors.description}
          />
          <FormField
            title="Amount"
            value={form?.totalAmount.toString()}
            placeholder="Enter amount"
            onChangeText={(e) => setForm({ ...form, totalAmount: Number(e) })}
            keyboardType="number-pad"
            otherStyles="mt-7"
            error={errors.totalAmount}
          />
          <Dropdown
            title="Paid By"
            placeholder="Select Member"
            options={
              users?.map((user) => ({
                label: user.name,
                value: user._id,
              })) ?? []
            }
            selected={form.paidBy}
            handlePress={(value) => {
              setForm({ ...form, paidBy: value });
            }}
            containerStyles="mt-7"
            error={errors.paidBy}
          />
          <Dropdown
            title="Group"
            placeholder="Select Group"
            options={
              groups?.map((group) => ({
                label: group.name,
                value: group._id,
              })) ?? []
            }
            selected={form.groupId}
            handlePress={(value) => {
              setForm({ ...form, groupId: value });
            }}
            containerStyles="mt-7"
            createNewLink="/groups"
            error={errors.groupId}
          />

          <View className="items-center justify-center w-full my-5 border border-dashed aspect-square bg-black/5 rounded-2xl border-black/5">
            {expenseData?.image || form.image ? (
              <View className="relative items-center w-full aspect-square">
                <Image
                  source={{
                    uri: form.image
                      ? form.image?.uri
                      : `${apiUrl}${expenseData?.image}`,
                  }}
                  className="w-full h-full"
                />
                <TouchableOpacity
                  className="absolute bottom-4 right-4"
                  onPress={pickImage}
                >
                  <View className="items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
                    <MaterialIcons name="edit" size={24} color="#fff" />
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <CustomButton
                title="Pick an image for the expense"
                handlePress={pickImage}
                containerStyles="bg-transparent mt-7"
                textStyles="text-sky-500 text-base font-pmedium"
              />
            )}
          </View>

          <CustomButton
            title="Save"
            handlePress={handleSubmit}
            containerStyles="mt-7"
            isLoading={createMutation.isPending || uppdateMutation.isPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
