import CustomButton from "@/components/custom-button";
import images from "@/constants/images";
import AuthContext from "@/context/auth";
import { Link, Redirect, router } from "expo-router";
import React, { useContext } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  const { userToken } = useContext(AuthContext);

  if (userToken) {
    return <Redirect href={{ pathname: "/home" }} />;
  }

  return (
    <SafeAreaView className="bg-white w-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex justify-between items-center h-full px-4">
          <Image
            source={images.hero}
            className="max-w-[420px] w-full h-[420px]"
            resizeMode="contain"
          />
          <View className="w-full items-center">
            <Text className="text-4xl font-pblack text-center text-primary mb-4">
              Smart Split
            </Text>
            <Text className="text-2xl font-pbold text-center mb-1">
              Split your shared expenses
            </Text>
            <Text className="text-sm text-center mb-5 font-pregular">
              Keep your expenses in check with SmartSplit, the ultimate app for
              splitting expenses with friends.
            </Text>
            <CustomButton
              title="Create an account"
              handlePress={() => router.push("/sign-up")}
              containerStyles="w-full mt-7"
            />
            <View className="text-sm gap-1 mt-4 flex-row">
              <Text className="text-black-100 font-pregular">
                Already have an account?
              </Text>
              <Link href="/sign-in" className="font-psemibold text-primary">
                Sign In
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
