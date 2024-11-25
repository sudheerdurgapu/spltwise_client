import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("token", token);
  } catch (e) {
    console.error("Failed to save token.");
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("token");
  } catch (e) {
    console.error("Failed to fetch token.");
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("token");
  } catch (e) {
    console.error("Failed to remove token.");
  }
};
