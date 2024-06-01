import React, { createContext, useEffect, useReducer} from "react";
import decks from "./decks";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DecksContext = createContext({});
const initialState = { decks };

const actions = {
  loadDecksFromStorage(state, action) {
    const loadedDecks = action.payload.decks;
    return {
      ...state,
      decks: loadedDecks,
    };
  },
  updateDeck(state, action) {
    const updated = action.payload;
    const updatedDecks = state.decks.map((u) =>
      u.id === updated.id ? updated : u
    );
    saveDecks(updatedDecks);
    return {
      ...state,
      decks: updatedDecks,
    };
  },
  // addNewDeck(newDeck) {
  //   const newDecksArray = [...state.decks, newDeck];
  //   saveDecks(newDecksArray);
  //   return {
  //    ...state,
  //     decks: newDecksArray,
  //   };
  // },
  addNewDeck(state, action) {
    const evento = action.payload;
    //define um id aleatório como id
    evento.id = Math.random();
    const updatedEvents = [...state.decks, evento];
    saveDecks(updatedEvents);
    console.log("salvo deck!");
    return {
      ...state,
      decks: updatedEvents,
    };
  },
  carregarEvents(state, action) {
    const loadedEvents = action.payload.decks;
    return {
      ...state,
      decks: loadedEvents,
    };
  },
  gerarRandom(state, action) {
    const loadedEvents = action.payload;
    return {
      ...state,
      decks: loadedEvents,
    };
  },
};

async function saveDecks(decks) {
  try {
    console.log("Salvando decks no AsyncStorage: ", decks);
    await AsyncStorage.setItem("decks", JSON.stringify(decks));
  } catch (error) {
    console.error("Erro ao salvar os decks no AsyncStorage: ", error);
  }
}
async function loadDecks() {
  try {
    const decks = await AsyncStorage.getItem("decks");
    return { decks: decks ? JSON.parse(decks) : [] };
  } catch (error) {
    console.error("Erro ao carregar os decks do AsyncStorage", error);
    return { decks: [] };
  }
}
export const DecksProvider = (props) => {
  useEffect(() => {
    async function fetchData() {
      //carrega os users do AsyncStorage utilizando a função loadDecks

      const loadedDecks = await loadDecks();
      if (loadedDecks.decks.length !== 0) {
      //se existirem users carregados, despacha uma ação para carregar os users no estado
        dispatch({ type: "carregarDecks", payload: loadedDecks });
      } else {        
        //se não, despacha uma ação para gerar users aleatórios
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
    <DecksContext.Provider value={{ state, dispatch }}>
      {props.children}
    </DecksContext.Provider>
  );
};

export default DecksContext;
