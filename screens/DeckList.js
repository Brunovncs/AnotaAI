import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ListItem } from "react-native-elements";
import DecksContext from "../Decks/DeckContextFile";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';



  const DeckList = (props = {}) => {
  const route = useRoute(); // Adicionado para acessar os parâmetros da rota

  const { state, dispatch } = useContext(DecksContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  // const [decks, setDecks] = useState(state.decks);

  const identificadorUsuario = route.params?.identificadorUsuario;

  useEffect(() => {
    async function fetchDecks() {
      try {
        
        // const savedDecks = await AsyncStorage.getItem("decks");

        // console.log(state.decks)
        // const decks = savedDecks ? JSON.parse(savedDecks) : [];
        
        // Filtrando os decks com base no userId
        const filteredDecks = state.decks.filter(deck => deck.userId == identificadorUsuario);

        // setDecks(filteredDecks);
        
        // dispatch({ type: "loadDecksFromStorage", payload: { decks: filteredDecks } });
  
        // // Verificando o isChecked de cada carta (card) nos decks filtrados
        filteredDecks.forEach(deck => {
          deck.cards.forEach(card => {
            console.log("isChecked:", card.isChecked);
          });
        });
      } catch (error) {
        console.error("Erro ao carregar os decks do AsyncStorage", error);
      }
    }
  
    if (isFocused) {
      fetchDecks();
    }
  }, [isFocused]);
  

  const resetDeckProgress = (deckId) => {
    dispatch({
      type: "updateDeckProgress",
      payload: {
        deckId,
        progress: { currentQuestionIndex: 0 },
      },
    });

    // Atualizar o estado decks após resetar o progresso
    const updatedDecks = state.decks.map(deck => {
      if (deck.id === deckId) {
        return {
          ...deck,
          cards: deck.cards.map(card => ({ ...card, isChecked: false })),
        };
      }
      return deck;
    });
    dispatch({ type: "loadDecksFromStorage", payload: { decks: updatedDecks } });
  };

  const renderItem = (item) => {
    const originalCards = item.cards.filter(card => card.isOriginal);
    const totalCards = originalCards.length;
    const cardsDecoradas = originalCards.filter(card => card.isChecked).length;
    const cardsRestantes = totalCards - cardsDecoradas;
    
    if(item.userId == identificadorUsuario){
    return (
      <ListItem
      key={item.id}
      containerStyle={styles.itemContainer}
      onPress={() => navigation.navigate("DeckQuestions", { deckId: item.id })}
    >
      <ListItem.Content style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <ListItem.Title style={styles.deckName}>{item.name}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>
            Total de Cartas: {item.cards.length}
          </ListItem.Subtitle>
          <ListItem.Subtitle style={styles.subtitle}>
            Cartas Decoradas:{" "}
            {cardsDecoradas}
          </ListItem.Subtitle>
          <ListItem.Subtitle style={styles.subtitle}>
            Cartas Restantes:{" "}
            {cardsRestantes}
          </ListItem.Subtitle>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => resetDeckProgress(item.id)}
          >
            <Text style={styles.resetButtonText}>Resetar Progresso</Text>
          </TouchableOpacity>
        </View>
        <Icon
          name="add"
          size={30}
          color="white"
          onPress={() => {
            props.navigation.navigate("AddCard", {cards: item.cards, cardId:item.id})}}
        />
      </ListItem.Content>
    </ListItem>
    );}
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

export default DeckList;