import React, { useContext, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import TestsContext from "../Decks/TestContextFile"; // Certifique-se de que o caminho esteja correto

export default () => {
  const { state } = useContext(TestsContext);
  const [selectedDeck, setSelectedDeck] = useState(state.decks[0]?.id || null);

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.question}>{item.question}</Text>
      <Text style={styles.answer}>{item.answer}</Text>
    </View>
  );

  const selectedDeckData = state.decks.find((deck) => deck.id === selectedDeck);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedDeck}
        onValueChange={(itemValue) => setSelectedDeck(itemValue)}
        style={styles.picker}
      >
        {state.decks.map((deck) => (
          <Picker.Item key={deck.id} label={deck.name} value={deck.id} />
        ))}
      </Picker>
      {selectedDeckData && (
        <View style={styles.deck}>
          <Text style={styles.deckTitle}>{selectedDeckData.name}</Text>
          <FlatList
            data={selectedDeckData.cards}
            renderItem={renderCard}
            keyExtractor={(card) => card.id.toString()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffeaa7",
    padding: 10,
  },
  picker: {
    height: 50,
    width: "50%",
    backgroundColor: "#84dcc6",
    marginBottom: 20,
  },
  deck: {
    marginBottom: 20,
    backgroundColor: "#ffeaa7",
    padding: 10,
    borderRadius: 5,
  },
  deckTitle: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#580c1f"
  },
  card: {
    backgroundColor: "#4ba3c3",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
  },
  answer: {
    fontSize: 15,
    color: "white",
  },
});
