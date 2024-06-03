import React, { useContext, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Icon } from "@rneui/themed";
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView
} from "@react-navigation/drawer";
import { Menu, Provider as PaperProvider } from "react-native-paper";
import DecksContext, { DecksProvider } from "../Decks/DeckContextFile";
import TestsContext, { TestsProvider } from "../Decks/TestContextFile";

import AddDeck from "../screens/AddDeck";
import DeckList from "../screens/DeckList";
import CardBrowser from "../screens/CardBrowser";
import DeckQuestions from "../screens/DeckQuestions";
import Estatisticas from "../screens/Estatisticas";

const Drawer = createDrawerNavigator();

export default (props) => (
  <PaperProvider>
    <DecksProvider>
      <Drawer.Navigator
        initialRouteName="Lista_de_Decks"
        screenOptions={screenOptions}
      >
        <Drawer.Screen
          name="Lista_de_Decks"
          component={DeckList}
          options={({ navigation }) => {
            useContext(DecksContext);
            const { dispatch } = useContext(DecksContext);
            return {
              title: "Decks",
              headerRight: () => <HeaderMenu navigation={navigation} />,
            };
          }}
        />
        <Drawer.Screen
          name="CardBrowser"
          component={CardBrowser}
          options={({ navigation }) => {
            const { dispatch } = useContext(DecksContext);
            return {
              title: "Perguntas",
            };
          }}
        />

        <Drawer.Screen
          name="DeckQuestions"
          component={DeckQuestions}
          options={({ navigation }) => {
            const { dispatch } = useContext(DecksContext);
            return {
              title: "AnotaAI",
              drawerItemStyle: { display: "none" },
              headerLeft: () => {
                const navigation = useNavigation(); // Use useNavigation hook here
                return (
                  <Button
                    onPress={() => navigation.navigate("Lista_de_Decks")}
                    type="clear"
                    icon={<Icon name="arrow-left" size={25} color="white" />}
                  />
                );
              },
            };
          }}
        />
        <Drawer.Screen
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
  </PaperProvider>
);

const HeaderMenu = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Button
        onPress={() => navigation.navigate("AddDeck")}
        type="clear"
        icon={<Icon name="add" size={25} color="white" />}
      />
      <View>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Button
              type="clear"
              icon={<Icon name="more-vert" size={25} color="white" />}
              onPress={openMenu}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              closeMenu();
              Alert.alert("Logout", "Deseja realmente sair?", [
                {
                  text: "Cancelar",
                  style: "cancel",
                },
                {
                  text: "Sim",
                  onPress: () => navigation.navigate("TelaLogin"),
                },
              ]);
            }}
            title="Logout"
            style={{ marginTop: 20 }}
          />
        </Menu>
      </View>
    </View>
  );
};

const screenOptions = {
  headerStyle: {
    backgroundColor: "#e17055",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
  drawerStyle: {
    backgroundColor: '#ffeaa7',
    width: 240,
  },
  drawerContentOptions: {
    activeBackgroundColor: '#fff', /* bg color for active screen */
    inactiveBackgroundColor: 'transparent', /* bg color for inactive screens */
  },
  drawerContentStyle: {
    flex: 1,
    backgroundColor: '#ffeaa7',
  },
  contentContainerStyle: {
    marginTop: 50,
    marginLeft: 10,
  },
  sceneContainerStyle: {
    backgroundColor: '#ffeaa7',
  }
};
