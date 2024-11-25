import { View, Text, ScrollView, Alert } from "react-native";
import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { registerUser } from "@/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type UserForm = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const {
    getValues,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UserForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      Alert.alert("Success", "Registration successful");
      reset();
      router.push("/home");
    },
    onError: (error: AxiosError) => {
      Alert.alert(
        "Registration Failed",
        error?.response?.data?.message || "Error"
      );
    },
  });

  const submitHandler = (data: UserForm) => {
    signUp(data);
  };
  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView>
        <View className="justify-center w-full h-full px-4 my-6">
          <Text className="mb-4 text-3xl font-pblack text-primary">
            Smart Split
          </Text>
          <Text className="mt-10 text-2xl font-psemibold">Sign up</Text>
          <FormField
            title="Username"
            value={getValues("name")}
            placeholder="Enter username"
            onChangeText={(e) => setValue("name", e, { shouldValidate: true })}
            otherStyles="mt-7"
            error={errors.name?.message}
          />
          <FormField
            title="Email"
            value={getValues("email")}
            placeholder="Enter email"
            onChangeText={(e) => setValue("email", e, { shouldValidate: true })}
            otherStyles="mt-7"
            keyboardType="email-address"
            error={errors.email?.message}
          />
          <FormField
            title="Password"
            value={getValues("password")}
            placeholder="Enter password"
            onChangeText={(e) =>
              setValue("password", e, { shouldValidate: true })
            }
            otherStyles="mt-7"
            error={errors.password?.message}
          />
          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit(submitHandler)}
            containerStyles="w-full mt-7"
            isLoading={isPending}
          />
          <View className="flex-row justify-center gap-1 mt-4 text-sm">
            <Text className="text-black-100 font-pregular">
              Already have an account?
            </Text>
            <Link href="/sign-in" className="font-psemibold text-primary">
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
