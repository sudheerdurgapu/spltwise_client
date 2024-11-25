import { View, Text, ScrollView, Alert } from "react-native";
import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/auth";
import { saveToken } from "@/utils/authStorage";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type Credentials = z.infer<typeof signInSchema>;

const SignIn = () => {
  const {
    getValues,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Credentials>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      reset();
      await saveToken(data.token);
      router.push("/home");
    },
    onError: (error: AxiosError) => {
      Alert.alert("Login Failed", error.response?.data?.message || "Error");
    },
  });

  const submitHandler = (data: Credentials) => {
    signIn(data);
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView>
        <View className="justify-center w-full h-full px-4 my-6">
          <Text className="mb-4 text-3xl font-pblack text-primary">
            Smart Split
          </Text>
          <Text className="mt-10 text-2xl font-psemibold">Sign In</Text>
          <FormField
            title="Email"
            value={getValues("email")}
            onChangeText={(e) => setValue("email", e, { shouldValidate: true })}
            otherStyles="mt-7"
            keyboardType="email-address"
            error={errors.email?.message}
          />
          <FormField
            title="Password"
            value={getValues("password")}
            onChangeText={(e) =>
              setValue("password", e, { shouldValidate: true })
            }
            otherStyles="mt-7"
            error={errors.password?.message}
          />
          <CustomButton
            title="Sign In"
            handlePress={handleSubmit(submitHandler)}
            containerStyles="w-full mt-7"
            isLoading={isPending}
          />
          <View className="flex-row justify-center gap-1 mt-4 text-sm">
            <Text className="text-black-100 font-pregular">
              Don't have account?
            </Text>
            <Link href="/sign-up" className="font-psemibold text-primary">
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
