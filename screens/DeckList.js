import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ListItem } from "react-native-elements";
import DecksContext from "../Decks/DeckContextFile";
import { useNavigation } from "@react-navigation/native";
import EventsContext from "../User/UserContextFile";
import TestsContext from "../Decks/TestContextFile";

export default (props) => {
  const { state, dispatch } = useContext(DecksContext);
  const navigation = useNavigation();

  console.log("DECKS: "+state.decks);

  const resetDeckProgress = (deckId) => {
    dispatch({
      type: "updateDeckProgress",
      payload: {
        deckId,
        progress: { currentQuestionIndex: 0 },
      },
    });
  };

  const renderItem = (item) => {
    const progress = state.progress[item.id] || { currentQuestionIndex: 0 };
    const cardsDecoradas = progress.currentQuestionIndex;
    const cardsRestantes = item.cards.length - cardsDecoradas;

    console.log("Rendering deck item: ", item);

    return (
      <ListItem
        key={item.id}
        containerStyle={styles.itemContainer}
        onPress={() => navigation.navigate("DeckQuestions", { deckId: item.id })}
      >
        <ListItem.Content>
          <ListItem.Title style={styles.deckName}>{item.name}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>Total de Cartas: {item.cards.length}</ListItem.Subtitle>
          <ListItem.Subtitle style={styles.subtitle}>Cartas Decoradas: {cardsDecoradas}</ListItem.Subtitle>
          <ListItem.Subtitle style={styles.subtitle}>Cartas Restantes: {cardsRestantes}</ListItem.Subtitle>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => resetDeckProgress(item.id)}
          >
            <Text style={styles.resetButtonText}>Resetar Progresso</Text>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
    );
  };

  if (state.decks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.debugText}>Nenhum item encontrado.</Text>
        <Text style={styles.debugText}>Adicione itens à lista para visualizá-los.</Text>
        <ListItem containerStyle={styles.itemContainer}>
          <ListItem.Content>
            <ListItem.Title style={styles.deckName}>Exemplo de Item</ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>Total de Cartas: 0</ListItem.Subtitle>
            <ListItem.Subtitle style={styles.subtitle}>Cartas Decoradas: 0</ListItem.Subtitle>
            <ListItem.Subtitle style={styles.subtitle}>Cartas Restantes: 0</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.debugText}>Componente sendo renderizado...</Text> */}
      {state.decks.map(renderItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffeaa7",
    padding: 10,
  },
  itemContainer: {
    backgroundColor: "#4a69bd",
    marginBottom: 10,
    borderRadius: 5,
  },
  deckName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fff",  // Define a cor do texto como branca
  },
  subtitle: {
    color: "#fff",  // Define a cor do texto como branca
  },
  resetButton: {
    backgroundColor: "transparent",
    alignSelf: "flex-end",
  },
  resetButtonText: {
    color: "#ffeaa7",
    fontWeight: "bold",
  },
  debugText: {
    fontSize: 16,
    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Space out the text and icon
    alignItems: "center", // Center items vertically
  },
});
