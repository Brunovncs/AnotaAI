import React, { useContext, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Icon, Button } from "@rneui/themed";
import TestsContext from "../Decks/TestContextFile"; // Certifique-se de que o caminho esteja correto
import DecksContext from "../Decks/DeckContextFile";

export default () => {
  const { state } = useContext(DecksContext);
  const [selectedDeck, setSelectedDeck] = useState(state.decks[0]?.id || null);

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.question}>{item.question}</Text>
        <Text style={styles.answer}>{item.answer}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Button
          type="clear"
          icon={<Icon name="edit" size={25} color="black" />}
        />
        <Button
          type="clear"
          icon={<Icon name="delete" size={25} color="black" />}
        />
      </View>
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
            keyExtractor={(card) => card.id}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", // Arrange items in a row
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Space out items horizontally
    backgroundColor: "#4ba3c3",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  textContainer: {
    flex: 1, // Allow text to take available space
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
  },
  answer: {
    fontSize: 14,
    color: "white",
  },
  iconContainer: {
    flexDirection: "row", // Arrange icons in a row
  },
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
    color: "#580c1f",
  },
});
