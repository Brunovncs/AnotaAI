const decks = [
  {
    id: 1,
    name: "Matemática",
    cards: [
      { id: 1, question: "Quanto é 2 + 2?", answer: "4", isChecked: false },
      {
        id: 2,
        question: "Qual é a raiz quadrada de 25?",
        answer: "5",
        isChecked: false,
      },
      // Adicione mais cartas conforme necessário
    ],
  },
  {
    id: 2,
    name: "Inglês",
    cards: [
      {
        id: 1,
        question: "What is 'hello' in Portuguese?",
        answer: "Olá",
        isChecked: false,
      },
      {
        id: 2,
        question: "Translate 'cat' to Portuguese",
        answer: "gato",
        isChecked: false,
      },
      // Adicione mais cartas conforme necessário
    ],
  },
];

export default decks;
