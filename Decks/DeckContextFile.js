import React, { createContext, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import decks from "./decks";

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
  function reducer(state, action) {
    const fn = actions[action.type];
    return fn ? fn(state, action) : state;
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchData() {
      const loadedDecks = await loadDecks();
      if (loadedDecks.decks === null) {
        // Se o AsyncStorage estiver vazio, inicialize com os decks do arquivo
        await saveDecks(initialState.decks);
        dispatch({ type: "loadDecksFromStorage", payload: { decks: initialState.decks } });
      } else {
        dispatch({ type: "loadDecksFromStorage", payload: loadedDecks });
      }
      console.log("Dispatch loadDecksFromStorage com payload: ", loadedDecks);
    }
    fetchData();
  }, []);

  return (
    <DecksContext.Provider value={{ state, dispatch }}>
      {props.children}
    </DecksContext.Provider>
  );
};

export { DecksContext };
