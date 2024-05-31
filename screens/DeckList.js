import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";
import { DecksContext } from "../Decks/DeckContextFile";
import { useNavigation } from "@react-navigation/native";

export default () => {
  const { state } = useContext(DecksContext);
  const navigation = useNavigation();

  // Função para renderizar cada item da lista
  const renderItem = (item) => (
    <ListItem
      key={item.id}
      containerStyle={styles.itemContainer}
      onPress={() => navigation.navigate("DetalhesDeck", { deckId: item.id })}
    >
      <ListItem.Content>
        <ListItem.Title style={styles.deckName}>{item.name}</ListItem.Title>
        <ListItem.Subtitle>Total de Cartas: {item.cards.length}</ListItem.Subtitle>
        <ListItem.Subtitle>Cartas Decoradas: {item.cards.filter((deck) => deck.isChecked).length}</ListItem.Subtitle>
        <ListItem.Subtitle>Cartas Restantes: {item.cards.filter((deck) => !deck.isChecked).length}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  const decks = state?.decks ?? [];
  console.log("Tamanho de state.decks:", decks.length);

  // Verifica se há itens na lista
  if (decks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.debugText}>Nenhum item encontrado.</Text>
        <Text style={styles.debugText}>Adicione itens à lista para visualizá-los.</Text>
        {/* Item de exemplo para debugging */}
        <ListItem containerStyle={styles.itemContainer}>
          <ListItem.Content>
            <ListItem.Title style={styles.deckName}>Exemplo de Item</ListItem.Title>
            <ListItem.Subtitle>Total de Cartas: 0</ListItem.Subtitle>
            <ListItem.Subtitle>Cartas Decoradas: 0</ListItem.Subtitle>
            <ListItem.Subtitle>Cartas Restantes: 0</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.debugText}>Componente sendo renderizado...</Text>
      {decks.map(renderItem)}
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
    marginBottom: 10,
    borderRadius: 5,
  },
  deckName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  debugText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
