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
import TestsContext from "../Decks/TestContextFile";
import DecksContext from "../Decks/DeckContextFile";
import { ListItem, Avatar, Icon, Button } from "@rneui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";

export default () => {
    const { state, dispatch } = useContext(DecksContext);
    const navigation = useNavigation();
    const route = useRoute();

    const [cards, SetCard] = useState(route.params.cards);
    const cardId = route.params?.cardId;

    console.log("ID: ", cardId);
    console.log("card: ", cards);

  return (
    <View style={styles.container}>
      {/* Centered Text Input for Perguntas */}
      <Text>Pergunta: </Text>
      <TextInput
        style={[styles.input, { backgroundColor: "white" }]} // White background for this input
        onChangeText={(question) => SetCard({ ...cards, question })}
        value={cards.question}
        placeholder="Digite a frente do cartão"
      />
        <Text>Resposta: </Text>
      <TextInput
        style={[styles.input, { backgroundColor: "white" }]} // White background for this input
        onChangeText={(answer) => SetCard({ ...cards, answer })}
        value={cards.answer}
        placeholder="Digite o verso do cartão"
      />      
      {/* Centered Round Border Button */}
      <TouchableOpacity
        onPress={() => {
          // Verifica se todos os campos foram preenchidos
          if (cards.answer && cards.question) {
            dispatch({
              // Cria ou atualiza o evento
              type: "addCardtoDeck",
              payload: {
              cards,
              id: cardId
            }});
            navigation.goBack();
          } else {
            Alert.alert(
              "Campos Vazios",
              "Por favor, preencha todos os campos."
            );
          }
        }}
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
