import React, { useContext, useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DecksContext from "../Decks/DeckContextFile";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [additionalQuestionsnumber, setAdditionalQuestions] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    const loadDeckAndAdditionalQuestions = async () => {
      try {
        const savedDecks = await AsyncStorage.getItem("decks");
        const decks = savedDecks ? JSON.parse(savedDecks) : [];
        const selectedDeck = decks.find((deck) => deck.id === deckId);

        if (!selectedDeck) {
          console.error(`Deck with id ${deckId} not found in AsyncStorage`);
          return;
        }

        const additionalLoadedQuestions = await loadAdditionalQuestions(deckId);
        const mixedQuestions = [
          ...selectedDeck.cards,
          ...additionalLoadedQuestions,
        ];
        setDeck({ ...selectedDeck, cards: mixedQuestions });

        const deckProgress = state.progress[deckId] || {
          currentQuestionIndex: 0,
        };
        setCurrentQuestionIndex(deckProgress.currentQuestionIndex);

        if (deckProgress.currentQuestionIndex <= mixedQuestions.length - 1) {
          setShowQuestion(true);
          setAllAnswered(false);
        } else {
          setShowQuestion(false);
          setAllAnswered(true);
        }
      } catch (error) {
        console.error("Erro ao carregar os decks do AsyncStorage", error);
      }
    };

    loadDeckAndAdditionalQuestions();
    setShowAnswer(false);
    setShowAnswerButtons(false);
  }, [deckId, state.progress]);

  const handleAnswer = async (difficulty) => {
    const additionalQuestionsKey = `additionalQuestions_${deckId}`;
    const additionalQuestions = await loadAdditionalQuestions(deckId);

    const repetitionCount = difficulty === "medium" ? 1 : difficulty === "hard" ? 2 : 0;

    let updatedAdditionalQuestions = [];
    for (let i = 0; i < repetitionCount; i++) {
      updatedAdditionalQuestions.push({
        ...deck.cards[currentQuestionIndex],
        id: Math.random().toString(),
        isOriginal: false,
        originalQuestionId: deck.cards[currentQuestionIndex].id,
      });
    }

    await saveAdditionalQuestions(deckId, [...additionalQuestions, ...updatedAdditionalQuestions]);

    const newIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(newIndex);
    updateDeckProgress(newIndex);
  };

  const saveAdditionalQuestions = async (deckId, questions) => {
    try {
      await AsyncStorage.setItem(`additionalQuestions_${deckId}`, JSON.stringify(questions));
    } catch (error) {
      console.error("Error saving additional questions to AsyncStorage: ", error);
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


  const loadAdditionalQuestions = async (deckId) => {
    try {
      const questions = await AsyncStorage.getItem(`additionalQuestions_${deckId}`);
      return questions ? JSON.parse(questions) : [];
    } catch (error) {
      console.error("Error loading additional questions from AsyncStorage: ", error);
      return [];
    }
  };

  if (!deck) {
    return (
      <View style={styles.container}>
        <Text style={styles.debugText}>Carregando...</Text>
      </View>
    );
  }

  // console.log("currentQuestionIndex: ", currentQuestionIndex);
  // console.log("additionalQuestionsnumber: ", additionalQuestionsnumber);
  // console.log("allAnsweredbefore: ", allAnswered);

  const currentQuestion = deck.cards[currentQuestionIndex];

  if (!currentQuestion) {
    // console.log("allAnswered: ", allAnswered);
    // console.log("showQuestion: ", showQuestion);
    // console.log("showAnswer: ", showAnswer);
  }

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        {showQuestion && currentQuestion && (
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        )}
        {showAnswer && currentQuestion && (
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
