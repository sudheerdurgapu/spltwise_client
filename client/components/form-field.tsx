import IonIcons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  type TextInputProps,
} from "react-native";

interface Props extends TextInputProps {
  title: string;
  otherStyles: string;
  error?: string;
}

const FormField = ({
  title,
  value,
  placeholder,
  onChangeText,
  otherStyles,
  error,
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-1 ${otherStyles}`}>
      <Text className="text-base text-black-100 font-pmedium">{title}</Text>
      <View className="w-full h-16 px-4 py-3 bg-white rounded-2xl border-2 border-black/5 focus:border-primary flex-1 flex-row items-center">
        <TextInput
          className="flex-1 font-pregular text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          onChangeText={onChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <IonIcons
              name={!showPassword ? "eye" : "eye-off"}
              size={30}
              color="#333333"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text className="text-base text-red-500 font-pregular">{error}</Text>
      ) : null}
    </View>
  );
};

export default FormField;
