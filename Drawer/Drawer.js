import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Icon } from "@rneui/themed";
import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";

import { DecksProvider, DecksContext } from "../Decks/DeckContextFile";

import AddDeck from "../screens/AddDeck";
import DeckList from "../screens/DeckList";
import CardBrowser from "../screens/CardBrowser";
import Estatisticas from "../screens/Estatisticas";

const Drawer = createDrawerNavigator();

export default (props) => (
  <DecksProvider>
    <Drawer.Navigator
      initialRouteName="Lista_de_Decks"
      screenOptions={screenOptions}
    >
      <Drawer.Screen // Tela de Login
        name="Lista_de_Decks"
        component={DeckList}
        options={({ navigation }) => {
          const { dispatch } = useContext(DecksContext);
          return {
            title: "Decks",
            headerRight: () =>         
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              onPress={() => props.navigation.navigate("AddDeck")}
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
          const { dispatch } = useContext(DecksContext);
          return {
            title: "Card Browser",
          };
        }}
      />
        <Drawer.Screen // Tela de Login
        name="Estatísticas"
        component={Estatisticas}
        options={({ navigation }) => {
          const { dispatch } = useContext(DecksContext);
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
  </DecksProvider>
);

const screenOptions = {
  headerStyle: {
    backgroundColor: "#e17055",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};
