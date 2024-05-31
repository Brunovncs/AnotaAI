import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Icon } from "@rneui/themed";
import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";

import { CardsProvider, EventsContext } from "../Cards/CardContextFile";

import LoginScreen from "../screens/LoginScreen";
import CardBrowser from "../screens/CardBrowser";
import Estatisticas from "../screens/Estatisticas";

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
            title: "Decks",
            headerRight: () =>         
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              onPress={() => props.navigation.navigate("AddCard")}
              type="clear" // pode ser solid ou outline, nesse caso é sem fundo
              icon={<Icon name="add" size={25} color="white" />}
            />
            <Button
              type="clear" // pode ser solid ou outline, nesse caso é sem fundo
              icon={<Icon name="more-vert" size={25} color="white" />}
            />
          </View>,
          };
        }}
      />
        <Drawer.Screen // Tela de Login
        name="BrowserScreen"
        component={CardBrowser}
        options={({ navigation }) => {
          const { dispatch } = useContext(EventsContext);
          return {
            title: "Card Browser",
          };
        }}
      />
        <Drawer.Screen // Tela de Login
        name="Estatísticas"
        component={Estatisticas}
        options={({ navigation }) => {
          const { dispatch } = useContext(EventsContext);
          return {
            title: "Estatísticas",
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
