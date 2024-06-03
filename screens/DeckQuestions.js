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
      const selectedDeck = state.decks.find((deck) => deck.id === deckId);
      const additionalLoadedQuestions = await loadAdditionalQuestions(deckId);
      const mixedQuestions = [...selectedDeck.cards, ...additionalLoadedQuestions];
      setDeck({ ...selectedDeck, cards: mixedQuestions });

      const deckProgress = state.progress[deckId] || { currentQuestionIndex: 0 };
      setCurrentQuestionIndex(deckProgress.currentQuestionIndex);

      if (deckProgress.currentQuestionIndex <= mixedQuestions.length - 1) {
        setShowQuestion(true);
        setAllAnswered(false);
      } else {
        setShowQuestion(false);
        setAllAnswered(true);
      }
    };

    loadDeckAndAdditionalQuestions();
    setShowAnswer(false);
    setShowAnswerButtons(false);
  }, [state.decks, deckId, state.progress]);

  const handleAnswer = async (difficulty) => {
    setShowAnswer(false);
    setShowAnswerButtons(false);
    let repetitionCount = 1; // Fácil
    if (difficulty === "medium") repetitionCount = 2; // Médio
    if (difficulty === "hard") repetitionCount = 3; // Difícil

    const additionalQuestionsKey = `additionalQuestions_${deckId}`;
    let additionalQuestions = [];

    try {
      const storedQuestions = await AsyncStorage.getItem(
        additionalQuestionsKey
      );
      if (storedQuestions) {
        additionalQuestions = JSON.parse(storedQuestions);
      }
    } catch (error) {
      console.error(
        "Erro ao carregar perguntas adicionais do AsyncStorage: ",
        error
      );
    }

    // Encontrar o maior ID atual
    let maxId = deck.cards.reduce(
      (max, card) => (card.id > max ? card.id : max),
      0
    );
    additionalQuestions.forEach((q) => {
      if (q.id > maxId) maxId = q.id;
    });
    maxId - 2;

    // Adicionar perguntas adicionais com novos IDs
    for (let i = 0; i < repetitionCount; i++) {
      maxId += 1;
      console.log("maxId: ", maxId)
      additionalQuestions.push({ ...currentQuestion, id: maxId });
    }

    await saveAdditionalQuestions(deckId, additionalQuestions);

    // Carrega perguntas adicionais após responder a uma pergunta
    const additionalLoadedQuestions = await loadAdditionalQuestions(deckId);
    const mixedQuestions = [...deck.cards, ...additionalLoadedQuestions];
    setDeck({ ...deck, cards: mixedQuestions });

    // Calcula o novo tamanho total de perguntas, incluindo perguntas originais e adicionais
    const totalQuestionsLength = mixedQuestions.length;
    setAdditionalQuestions(totalQuestionsLength);

    // console.log("additionalQueastionnumber : ", additionalQuestionsnumber)
    // console.log("totalQuestionsLength: ", mixedQuestions.length)
    // console.log("currentQuestionIndex: ", currentQuestionIndex)
    if (currentQuestionIndex < totalQuestionsLength - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      updateDeckProgress(newIndex);
    } else {
      // setAllAnswered(true);
      // setShowQuestion(false);
      updateDeckProgress(totalQuestionsLength);
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

  async function saveAdditionalQuestions(deckId, questions) {
    try {
      await AsyncStorage.setItem(`additionalQuestions_${deckId}`, JSON.stringify(questions));
      console.log("questionadd:", questions);
    } catch (error) {
      console.error(
        "Erro ao salvar perguntas adicionais no AsyncStorage: ",
        error
      );
    }
  }

  async function loadAdditionalQuestions(deckId) {
    try {
      const questions = await AsyncStorage.getItem(
        `additionalQuestions_${deckId}`
      );
      return questions ? JSON.parse(questions) : [];
    } catch (error) {
      console.error(
        "Erro ao carregar perguntas adicionais do AsyncStorage: ",
        error
      );
      return [];
    }
  }

  if (!deck) {
    return (
      <View style={styles.container}>
        <Text style={styles.debugText}>Carregando...</Text>
      </View>
    );
  }

  console.log("deck: ", deck.cards[2]);
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
