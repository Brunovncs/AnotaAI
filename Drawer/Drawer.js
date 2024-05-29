import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Icon } from "@rneui/themed";
import { createDrawerNavigator } from "@react-navigation/drawer";



import { CardsProvider, EventsContext } from "../Cards/CardContextFile";

import LoginScreen from "../screens/LoginScreen";


const Drawer = createDrawerNavigator();

export default (props) => (
    <CardsProvider>
      <Drawer.Navigator
        initialRouteName="LoginScreen01"
        screenOptions={screenOptions}
      >
        <Drawer.Screen // Tela de Login
        name="LoginScreen01"
        component={LoginScreen}
        options={({ navigation }) => {
          const { dispatch } = useContext(EventsContext);
          return {
            title: "Tela de login",
            headerRight: () => (
              <View>
              </View>
            ),
          };
        }}
        />
        {/* <Drawer.Screen // Tela de decks

        />
        <Drawer.Screen // ...

        /> */}

        {/* Outras telas Drawer aqui */}
      </Drawer.Navigator>
    </CardsProvider>
  );
  
  const screenOptions = {
    headerStyle: {
      backgroundColor: "#333",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
  };