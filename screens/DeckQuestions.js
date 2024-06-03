import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DecksContext from "../Decks/DeckContextFile";

const DeckQuestions = () => {
  const { state, dispatch } = useContext(DecksContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { deckId } = route.params;
  const [deck, setDeck] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswerButtons, setShowAnswerButtons] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false); // Estado para mostrar a resposta
  const [allAnswered, setAllAnswered] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);

  useEffect(() => {
    const selectedDeck = state.decks.find((deck) => deck.id === deckId);
    setDeck(selectedDeck);
    const deckProgress = state.progress[deckId] || { currentQuestionIndex: 0 };
    setCurrentQuestionIndex(deckProgress.currentQuestionIndex);
    if (deckProgress.currentQuestionIndex <= selectedDeck.cards.length - 1) {
      console.log("entrou no if: deckProgress.currentquestionindex: ", deckProgress.currentQuestionIndex)
      console.log("entrou no if: selectedDeck.cards.length: ", selectedDeck.cards.length)

      setShowQuestion(true);
      setAllAnswered(false);
    } else {
      setShowQuestion(false);
      setAllAnswered(true);
    }
    setShowAnswer(false);
    setShowAnswerButtons(false);
  }, [state.decks, deckId, state.progress]);

  const handleAnswer = (difficulty) => {
    setShowAnswer(false);
    setShowAnswerButtons(false);
    if (currentQuestionIndex < deck.cards.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      updateDeckProgress(newIndex);
    } else {
      setAllAnswered(true);
      setShowQuestion(false);
      updateDeckProgress(deck.cards.length);
    }
  };

  const updateDeckProgress = (newIndex) => {
    dispatch({
      type: "updateDeckProgress",
      payload: {
        deckId,
        progress: { currentQuestionIndex: newIndex },
      },
    });
  };

  const handleShowAnswerButtons = () => {
    setShowAnswer(true);
    setShowAnswerButtons(true);
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
        {showQuestion && (
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        )}
        {showAnswer && (
          <Text style={styles.answerText}>{currentQuestion.answer}</Text>
        )}
        {!allAnswered && !showAnswerButtons && (
          <TouchableOpacity
            style={[styles.answerButton, styles.singleAnswerButton]}
            onPress={handleShowAnswerButtons}
          >
            <Text style={styles.answerButtonText}>Resposta</Text>
          </TouchableOpacity>
        )}
        {showAnswerButtons && (
          <View style={styles.answerButtonsContainer}>
            <TouchableOpacity
              style={styles.answerButton}
              onPress={() => handleAnswer("easy")}
            >
              <Text style={styles.answerButtonText}>Fácil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.answerButton}
              onPress={() => handleAnswer("medium")}
            >
              <Text style={styles.answerButtonText}>Médio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.answerButton}
              onPress={() => handleAnswer("hard")}
            >
              <Text style={styles.answerButtonText}>Difícil</Text>
            </TouchableOpacity>
          </View>
        )}
        {allAnswered && (
          <Text style={styles.answerText}>
            Parabéns, você finalizou seu deck por hoje!
          </Text>
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
    backgroundColor: "#4a69bd",
    marginBottom: 0,
    borderRadius: 0,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  questionText: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginTop: 320,
  },
  answerText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  answerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 0,
  },
  answerButton: {
    backgroundColor: "#38ada9",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 340,
    width: "25%",
    height: 50,
  },
  singleAnswerButton: {
    width: "50%",
    marginTop: 340,
  },
  answerButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  debugText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default DeckQuestions;
