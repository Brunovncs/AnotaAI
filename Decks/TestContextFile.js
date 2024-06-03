import React, { createContext, useEffect, useReducer } from "react";
import { Alert } from "react-native";
import decks from "./decks";

const TestsContext = createContext({});
const initialState = { decks };

import AsyncStorage from "@react-native-async-storage/async-storage";
const actions = {
  addCardtoDeck(state, action) {
    const { cards, id } = action.payload;
    const updatedEvents = state.decks.map((evento) => {
      if (evento.id == id) {
    console.log("ENCONTROU")
          if (evento.cards == null) {
            evento.cards = [];
          }
          const newCard = { ...cards, id: Math.random().toString() };

          const updatedLista = [...evento.cards, newCard]; // atualiza a lista
        //   const updatedLista = [...evento.cards,  cards]; //atualiza a lista
         console.log(updatedLista);     
          return { ...evento, cards: updatedLista }; //retorna a lista atualizada

      }
      return evento;
    });

    saveTests(updatedEvents);  

    return { ...state, decks: updatedEvents };
  },
  deleteEvent(state, action) {
    const evento = action.payload;
    //filtra os decks existentes para remover o evento com o ID correspondente
    const updatedTests = state.decks.filter((u) => u.id !== evento.id);
    saveTests(updatedTests); //salva o evento atualizado no async storage
    return {
      ...state,
      decks: updatedTests,
    };
  },
  createEvent(state, action) {
    const evento = action.payload;
    //define um id aleatório como id
    evento.id = Math.random();
    const updatedTests = [...state.decks, evento];
    saveTests(updatedTests);
    console.log("deck salvo!");
    return {
      ...state,
      decks: updatedTests,
    };
  },
  updateEvent(state, action) {
    const updated = action.payload;
    //mapeia os decks existentes no estado, substituindo o evento com o mesmo id pelo evento atualizado
    const updatedTests = state.decks.map((u) =>
      u.id === updated.id ? updated : u
    );
    saveTests(updatedTests);
    return {
      ...state,
      decks: updatedTests,
    };
  },
  updateSenha(state, action) {
    const updated = action.payload;
    //mapeia os decks existentes no estado, substituindo o evento com o mesmo id pelo evento atualizado
    const updatedTests = state.decks.map((u) =>
      u.email === updated.email ? updated : u
    );
    console.log("senha atualizada");
    saveTests(updatedTests);
    return {
      ...state,
      decks: updatedTests,
    };
  },
  carregarTests(state, action) {
    const loadedTests = action.payload.decks;
    return {
      ...state,
      decks: loadedTests,
    };
  },
  gerarRandom(state, action) {
    const loadedTests = action.payload;
    return {
      ...state,
      decks: loadedTests,
    };
  },
};
async function deleteTests() {
  try {
    await AsyncStorage.removeItem("decks"); //remove decks do AsyncStorage
    console.log("Usuarios removidos com sucesso");
  } catch (error) {
    //captura os erros e mostra uma mensagem de erro
    console.error("Erro ao remover os usuarios do AsyncStorage", error);
  }
}
async function saveTests(decks) {
  try {
    //converte decks para uma string JSON e salva no AsyncStorage
    await AsyncStorage.setItem("decks", JSON.stringify(decks));
  } catch (error) {
    console.error("Erro ao salvar os usuarios no AsyncStorage:", error);
  }
}
async function loadTests() {
  try {
    //tenta obter os decks salvos no AsyncStorage
    const decks = await AsyncStorage.getItem("decks");
    //se decks existir no AsyncStorage, converte a string JSON de 'decks' para um array
    //se não, retorna um array vazio
    return { decks: decks ? JSON.parse(decks) : [] };
  } catch (error) {
    console.error("Erro ao carregar os usuarios do AsyncStorge", error);
    return { decks: [] }; //retorna decks vazio
  }
}

export const TestsProvider = (props) => {
  useEffect(() => {
    async function fetchData() {
      //carrega os decks do AsyncStorage utilizando a função loadTests

      const loadedTests = await loadTests();
      if (loadedTests.decks.length !== 0) {
        //se existirem decks carregados, despacha uma ação para carregar os decks no estado
        dispatch({ type: "carregarTests", payload: loadedTests });
      } else {
        //se não, despacha uma ação para gerar decks aleatórios
        dispatch({ type: "gerarRandom", payload: decks });
      }
    }
    fetchData();
  }, []);

  function reducer(state, action) {
    //obtém a função correspondente à ação do actions
    const fn = actions[action.type];
    //executa a função correspondente se existir, senão retorna o estado atual
    return fn ? fn(state, action) : state;
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <TestsContext.Provider value={{ state, dispatch }}>
      {props.children}
    </TestsContext.Provider>
  );
};

export default TestsContext;
