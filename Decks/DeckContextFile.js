import React, { createContext, useEffect, useReducer } from "react";
import decks from "./decks";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DecksContext = createContext({});
const initialState = { decks, progress: {} };

const actions = {
  deleteEvent(state, action) {
    const evento = action.payload;
      //filtra os eventos existentes para remover o evento com o ID correspondente
    const updatedEvents = state.decks.filter((u) => u.id !== evento.id);
    saveDecks(updatedEvents);//salva o evento atualizado no async storage 
    return {
      ...state, 
      decks: updatedEvents,
    }; 
  },
  resetOriginalQuestionsChecked(state, action) {
    const updatedDecks = state.decks.map((deck) => {
      const updatedCards = deck.cards.map((card) => {
        if (card.isOriginal) {
          return { ...card, isChecked: false };
        }
        return card;
      });
      return { ...deck, cards: updatedCards };
    });
    saveDecks(updatedDecks); // Salva os decks atualizados no AsyncStorage
    return { ...state, decks: updatedDecks };
  },
  deleteReserva(state, action) {
    const { item, selectedDeck} = action.payload;//recebe os parâmetros enviados 

    const updatedEvents = state.decks.map((evento) => {//mapeia o evento atualizado 
      if(evento.id == selectedDeck){

      if(evento.cards == null)//se nâo existir uma lista para esse evento ela é criada 
          evento.cards = []
      const updatedLista = evento.cards.filter((reserva) => reserva.id !== item);//filtra a lista de reservas para tirar a reserva com o cpf correspondente
      return { ...evento, cards: updatedLista };//retorna a lista atualizada 

  }
    return evento;
});

    saveDecks(updatedEvents); //salva os eventos atualizados 
    loadDecks(updatedEvents);

    //retorna o estado com os eventos atualizados
    console.log("RESULTADO: " + updatedEvents)
    console.log("acabouuu")
    return { ...state, decks: updatedEvents };
  },
  updateReservation(state, action) {
    const { cardId, updatedReserva, id} = action.payload;
    console.log("dentro da funçao cardId: " + cardId);
    const updatedEvents = state.decks.map((evento) => {
      if (evento.cards) {
        console.log("dentro da funçao id do evento: " + evento.id);
        if(evento.id == id){
          console.log("encontrou o deck");
            const updatedLista = evento.cards.map((reserva) =>
              reserva.id === cardId ? { ...reserva, ...updatedReserva } : reserva
            );
            return { ...evento, cards: updatedLista };//retorna o evento com a lista atualizada de reservas
        }
      }
      return evento;
    });
    //salva os eventos atualizados no AsyncStorage
    saveDecks(updatedEvents); 
    loadDecks(updatedEvents);
    //retorna o estado atualizado com os eventos atualizados
    return { ...state, decks: updatedEvents };
  },
  addCardtoDeck(state, action) {
    const { cards, id } = action.payload;
    const updatedEvents = state.decks.map((evento) => {
      if (evento.id == id) {
          if (evento.cards == null) {
            evento.cards = [];
          }
          let num = evento.cards.length;
          const newCard = { ...cards, id: Math.random().toString(),isOriginal: true, isChecked: false };
          // const newCard = { ...cards, id: num, isOriginal: true, isChecked: false };

          const updatedLista = [...evento.cards, newCard]; // atualiza a listaa
          console.log("ID DO CARD NO DECK: " +  newCard.id)

          console.log("LISTA: " + updatedLista)
        //   const updatedLista = [...evento.cards,  cards]; //atualiza a lista
          return { ...evento, cards: updatedLista }; //retorna a lista atualizada
      }
      return evento;
    });
    saveDecks(updatedEvents);  
    return { ...state, decks: updatedEvents };
  },
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
  createEvent(state, action) {
    const evento = action.payload;
    //define um id aleatório como id
    evento.id = Math.random();
    const updatedDecks = [...state.decks, evento];

    saveDecks(updatedDecks);
    // loadDecks(updatedDecks);
    return {
      ...state,
      decks: updatedDecks,
    };
  },
  updateSenha(state, action) {
    const updated = action.payload;
    //mapeia os decks existentes no estado, substituindo o evento com o mesmo id pelo evento atualizado
    const updatedTests = state.decks.map((u) =>
      u.email === updated.email ? updated : u
    );
    saveDecks(updatedTests);
    return {
      ...state,
      decks: updatedTests,
    };
  },
  addNewDeck(state, action) {
    const newDeck = action.payload;
    newDeck.id = Math.random();
    const newDecksArray = [...state.decks, newDeck];
    saveDecks(newDecksArray);
    return {
     ...state,
      decks: newDecksArray,
    };
  },
  updateDeckProgress(state, action) {
    const { deckId, progress } = action.payload;
    const updatedProgress = {
      ...state.progress,
      [deckId]: progress,
    };
    saveProgress(updatedProgress);
    return {
      ...state,
      progress: updatedProgress,
    };
  },
  loadDeckProgress(state, action) {
    const loadedProgress = action.payload.progress;
    return {
      ...state,
      progress: loadedProgress,
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
  }
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

async function saveProgress(progress) {
  try {
    console.log("Salvando progresso no AsyncStorage: ", progress);
    await AsyncStorage.setItem("progress", JSON.stringify(progress));
  } catch (error) {
    console.error("Erro ao salvar o progresso no AsyncStorage: ", error);
  }
}

async function loadProgress() {
  try {
    const progress = await AsyncStorage.getItem("progress");
    return { progress: progress ? JSON.parse(progress) : {} };
  } catch (error) {
    console.error("Erro ao carregar o progresso do AsyncStorage", error);
    return { progress: {} };
  }
}

export const DecksProvider = (props) => {
  useEffect(() => {
    async function fetchData() {
      //carrega os decks do AsyncStorage utilizando a função loadDecks
      const loadedDecks = await loadDecks();
      const loadedProgress = await loadProgress();
      if(loadedDecks.decks.length !== 0){
        dispatch({ type: "loadDecksFromStorage", payload: loadedDecks });
        dispatch({ type: "loadDeckProgress", payload: loadedProgress });
      }else{
        await saveDecks(decks)
      }
    }
    fetchData();
  }, []);

  function reducer(state, action) {
    const fn = actions[action.type];
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
