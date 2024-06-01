import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DecksContext } from "../Decks/DeckContextFile";

const DeckQuestions = () => {
  const { state, dispatch } = useContext(DecksContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { deckId } = route.params;
  const [deck, setDeck] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswerButtons, setShowAnswerButtons] = useState(false);

  useEffect(() => {
    const selectedDeck = state.decks.find(deck => deck.id === deckId);
    setDeck(selectedDeck);
  }, [state.decks, deckId]);

  const handleAnswer = (difficulty) => {
    console.log(`Pergunta ${currentQuestionIndex} respondida com dificuldade: ${difficulty}`);
    setShowAnswerButtons(false);
    if (currentQuestionIndex < deck.cards.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("Todas as perguntas foram respondidas");
    }
  };

  const handleShowAnswerButtons = () => {
    setShowAnswerButtons(true);
  };

  const handleAddQuestion = () => {
    console.log("Adicionar nova pergunta");
  };

  if (!deck) {
    return (
      <View style={styles.container}>
        <Text style={styles.debugText}>Carregando...</Text>
      </View>
    );
  }

  const currentQuestion = deck.cards[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        {showAnswerButtons ? (
          <View style={styles.answerButtonsContainer}>
            <TouchableOpacity style={styles.answerButton} onPress={() => handleAnswer('easy')}>
              <Text style={styles.answerButtonText}>Fácil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.answerButton} onPress={() => handleAnswer('medium')}>
              <Text style={styles.answerButtonText}>Médio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.answerButton} onPress={() => handleAnswer('hard')}>
              <Text style={styles.answerButtonText}>Difícil</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.answerButton, styles.singleAnswerButton]} onPress={handleShowAnswerButtons}>
            <Text style={styles.answerButtonText}>Resposta</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffeaa7",
    padding: 0,
  },
  questionContainer: {
    flex: 1,
    backgroundColor: "#1e3799",
    marginBottom: 0,
    borderRadius: 0,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 24,
    color: "#fff",
    textAlign: 'center',
    marginTop: 320,
  },
  answerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: '100%',
    marginBottom: 0,
  },
  answerButton: {
    backgroundColor: "#38ada9",
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 340,
    width: '25%',
    height: 50,
  },
  singleAnswerButton: {
    width: '50%',
    marginTop: 340,
  },
  answerButtonText: {
    fontSize:18,
    color: "#fff",
  },
  debugText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default DeckQuestions;