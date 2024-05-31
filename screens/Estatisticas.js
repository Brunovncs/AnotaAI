import React, { useContext } from "react";
import { View, Alert, FlatList, StyleSheet } from "react-native";
import { EventsContext } from "../Cards/CardContextFile";
import { ListItem, Avatar, Icon, Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native"; // Import the hook

export default () => { // Arquivo responsável por editar eventos específicos
  const { state, dispatch } = useContext(EventsContext);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b2bec3", // Altere para a cor de fundo desejada
  },
  item: {
    backgroundColor: "#b2bec3", // cor de fundo padrão
  },
});