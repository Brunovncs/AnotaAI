import React, { createContext, useEffect, useReducer } from "react";
import decks from "./decks";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DecksContext = createContext({});
const initialState = { decks };

const actions = {
  // Adicione esta ação ao seu objeto de ações
  updateDeckIsChecked(state, action) {
    const { id, isChecked } = action.payload;
    const updatedDecks = state.decks.map((e) => {
      if (e.id === id) {
        return {...e, isChecked };
      }
      return e;
    });
    saveDecks(updatedDecks);
    return {
     ...state,
      decks: updatedDecks,
    };
  },
  markDeckAsChecked(state, action) {
    const { deck, nome, quantidade } = action.payload;
    
    const updatedDecks = state.decks.map((e) => {
        if (e.id === deck.id) {
          // Verifica se há ingressos disponíveis para reserva
          if (e.ingDisp >= quantidade) {
            return {
              ...e,
              isChecked: true,
              ingDisp: e.ingDisp - quantidade, // Diminui o número de ingressos disponíveis
              reservations: [...(e.reservations || []), { nome, quantidade }],
            };
          } else {
            // Se não houver ingressos disponíveis suficientes, mantém o evento inalterado
            return e;
          }
        }
      return e;
    });
    saveDecks(updatedDecks);
    return {
      ...state,
      decks: updatedDecks,
    };
  },
  unmarkDeckAsChecked(state, action) {
    const eventId = action.payload.id; // Ajuste aqui para acessar a propriedade 'id' corretamente
    const updatedDecks = state.decks.map((u) =>
      u.id === eventId? {...u, isChecked: false } : u
    );
    saveDecks(updatedDecks);
    return {
     ...state,
      decks: updatedDecks,
    };
  },  
  deleteAllDecks(state, action) {
    deleteDecks();
    return {
      ...state,
      decks: [],
    };
  },
  carregarDecks(state, action) {
    const loadedDecks = action.payload.decks;
    return {
      ...state,
      decks: loadedDecks,
    };
  },
  gerarRandom(state, action) {
    const loadedDecks = action.payload;
    return {
      ...state,
      decks: loadDecks,
    };
  },
  deleteDeck(state, action) {
    const deck = action.payload;
    const updatedDecks = state.decks.filter((u) => u.id !== deck.id);
    return {
      ...state, //opcional no caso de 1 estado, se tiver mais estados precisa clonalos com essa linha
      decks: updatedDecks,
    }; //estado é evoluido
  },
  createDeck(state, action) {
    const deck = action.payload;
    deck.id = Math.random();
    const updatedDecks = [...state.decks, deck];
    saveDecks(updatedDecks);
    return {
      ...state,
      decks: updatedDecks,
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
  updateDeckIsFav(state, action) {
    const { id, isFav } = action.payload;
  
    // Atualize o evento com o novo estado de favorito
    const updatedDecks = state.decks.map((e) => {
      if (e.id === id) {
        return { ...e, isFav };
      }
      return e;
    });
  
    // Reordene os eventos com base no favoritismo, colocando os eventos favoritos no topo da lista
    const sortedDecks = updatedDecks.sort((a, b) => {
      if (a.isFav && !b.isFav) {
        return -1; // Coloca 'a' (evento favorito) antes de 'b' (evento não favorito)
      } else if (!a.isFav && b.isFav) {
        return 1; // Coloca 'b' (evento favorito) antes de 'a' (evento não favorito)
      } else {
        return 0; // Mantém a ordem original
      }
    });
  
    // Salve os eventos atualizados no AsyncStorage
    saveDecks(sortedDecks);
  
    // Retorne o novo estado com os eventos reordenados
    return {
      ...state,
      decks: sortedDecks,
    };
  },
  filterDecksByName(state, action) {
    const { name } = action.payload;
    const filteredDecks = state.decks.filter(deck => deck.name.toLowerCase().includes(name.toLowerCase()));
    return {
     ...state,
      decks: filteredDecks,
    };
  },
  clearFilter(state, action) {
    return {
      ...state,
      decks: initialState.decks, // Carrega todos os eventos novamente
    };
  },
};

async function saveDecks(decks) {
  try {
    await AsyncStorage.setItem("decks", JSON.stringify(decks));
  } catch (error) {
    console.error("Error ao salvar os usuarios no AsyncStorage: ", error);
  }
}

async function deleteDecks(decks) {
  try {
    await AsyncStorage.removeItem("decks");
    console.log("Usuarios removidos com sucesso");
  } catch (error) {
    console.log("Erro ao remover os usuarios do AsyncStorage", error);
  }
}

async function loadDecks() {
  try {
    const decks = await AsyncStorage.getItem("decks");
    return { decks: decks ? JSON.parse(decks) : [] };
  } catch (error) {
    console.error("Erro ao carregar os usuarios do AsyncStorage", error);
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
      dispatch({ type: "carregarDecks", payload: loadedDecks });
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
