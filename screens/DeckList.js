import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { DecksContext } from "../Decks/DeckContextFile";
import { useNavigation } from "@react-navigation/native";

export default () => {
  const { state } = useContext(DecksContext);
  const navigation = useNavigation();

  console.log("State decks:", state.decks);

  // Função para renderizar cada item da lista
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate("DetalhesDeck", { deckId: item.id })}
    >
      <Text style={styles.deckName}>{item.name}</Text>
      <Text>Total de Cartas: {item.decks.length}</Text>
      <Text>
        Cartas Decoradas: {item.decks.filter((deck) => deck.isChecked).length}
      </Text>
      <Text>
        Cartas Restantes: {item.decks.filter((deck) => !deck.isChecked).length}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={state.decks}
        renderItem={({ item }) => {
          // console.log("Item sendo renderizado:", item); // Debugging print
          return (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() =>
                navigation.navigate("DetalhesDeck", { deckId: item.id })
              }
            >
              <Text style={styles.deckName}>{item.name}</Text>
              <Text>Total de Cartas: {item.cards.length}</Text>
              <Text>
                Cartas Decoradas:{" "}
                {item.cards.filter((deck) => deck.isChecked).length}
              </Text>
              <Text>
                Cartas Restantes:{" "}
                {item.cards.filter((deck) => !deck.isChecked).length}
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        onContentSizeChange={(contentWidth, contentHeight) => {
          // console.log("Número total de itens:", state.decks.length); // Debugging print
        }}
      />
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
    backgroundColor: "#b2bec3",
    padding: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  deckName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
