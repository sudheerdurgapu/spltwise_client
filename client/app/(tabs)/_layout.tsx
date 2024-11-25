import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";

interface Props
  extends IconProps<ComponentProps<typeof MaterialIcons>["name"]> {
  title: string;
  focused: boolean;
}

const TabIcon = ({ color, name, title, focused }: Props) => {
  return (
    <View className="items-center justify-center w-24 gap-1">
      <MaterialIcons name={name} size={30} color={color} />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs flex-grow whitespace-nowrap`}
        style={{ color }}
      >
        {title}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#6C62D2",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#EEEEEE",
            height: 84,
            paddingTop: 20,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="home"
                title="Home"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="groups"
          options={{
            title: "Group",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="group"
                title="Groups"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="add-circle"
                title="Create"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="expense"
          options={{
            title: "Expense",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="attach-money"
                title="Expenses"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="person"
                title="Profile"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
