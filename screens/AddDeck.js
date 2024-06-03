import React, { useContext, useState } from "react";
import {
  View,
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import DecksContext from "../Decks/DeckContextFile";
import TestsContext from "../Decks/TestContextFile";
import { ListItem, Avatar, Icon, Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import decks from "../Decks/decks";
import { useRoute } from "@react-navigation/native";


export default () => {
  const route = useRoute();

  const deckUserId = route.params;
  const navigation = useNavigation();
  const [nomeDeck, SetNomeDeck] = useState({
    name: "",
    cards: [],
    userId: deckUserId
  });

  const { dispatch } = useContext(DecksContext);

  return (
    <View style={styles.container}>
      {/* Centered Text Input for Perguntas */}
      <Text>Nome do Deck: </Text>
      <TextInput
        style={[styles.input, { backgroundColor: "white" }]} // White background for this input
        onChangeText={(name) => SetNomeDeck({ ...nomeDeck, name })}
        value={nomeDeck.name}
        placeholder="Digite o nome do deck"
      />
      {/* Centered Round Border Button */}
      <TouchableOpacity
        onPress={() => {
          // Verifica se todos os campos foram preenchidos
          if (nomeDeck.name) {
            dispatch({
              // Cria ou atualiza o evento
              type: "createEvent",
              payload: nomeDeck,
            });
            navigation.goBack();
          } else {
            Alert.alert(
              "Campos Vazios",
              "Por favor, preencha todos os campos."
            );
          }
        }
      }
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffeaa7",
    alignItems: "center", // Center items horizontally
  },
  input: {
    height: 50, // Smaller size
    marginVertical: 10,
    padding: 10,
    borderRadius: 5, // More rounded borders
    borderWidth: 1,
    borderColor: "#ccc",
    width: "80%", // Make the input take up less space
  },
  addButton: {
    backgroundColor: "#219ebc",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20, // More rounded corners
    width: 200, // Smaller size
    height: 40,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
