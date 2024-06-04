import React, { createContext, useEffect, useReducer } from "react";
import {
  Alert,
} from 'react-native';
// import users from "./users";
import users from "./users";

const EventsContext = createContext({});
const initialState = { users };

import AsyncStorage from "@react-native-async-storage/async-storage";
const actions = {
  deleteReserva(state, action) {
    const { cpf, listaItems, id} = action.payload;//recebe os parâmetros enviados 

    const updatedEvents = state.users.map((evento) => {//mapeia o evento atualizado 
      if(evento.id == id){//encontrar o evento que a reserva foi feia
        //aumentar os ingressos disponíveis 
        evento.ingDisp = parseInt(evento.ingDisp) + parseInt(listaItems.numIngressos);
      }
      if(evento.lista == null)//se nâo existir uma lista para esse evento ela é criada 
          evento.lista = []
      const updatedLista = evento.lista.filter((reserva) => reserva.cpf !== cpf);//filtra a lista de reservas para tirar a reserva com o cpf correspondente
      return { ...evento, lista: updatedLista };//retorna a lista atualizada 

    });

    saveEvents(updatedEvents); //salva os users atualizados 
    //retorna o estado com os users atualizados
    return { ...state, users: updatedEvents };
  },

  deletarTodos(state, action) {
    deleteEvents();
    return {//retorna o estado com os users vazios
      ...state, 
      users: [],
    }; 
  },
 
  adicionarReserva(state, action) {
    const { novaReserva, id } = action.payload; 
    const updatedEvents = state.users.map((evento) => {//mapeia os users atualizados
      if (evento.id == id) {//encontra o evento da reserva 
        if ((parseInt(evento.ingDisp) - parseInt(novaReserva.numIngressos)) >= 0) {
          //diminui o número de ingressos disponíveis 
          evento.ingDisp = parseInt(evento.ingDisp) - parseInt(novaReserva.numIngressos);
          if(evento.lista == null){
              evento.lista = [];
          }
          const updatedLista = [...evento.lista, novaReserva];//atualiza a lista 
          return { ...evento, lista: updatedLista }; //retorna a lista atualizada 
        }else{//caso não tenha ingresso suficienten
          Alert.alert("Ingresso Insuficiente","O usuário não foi adicionado pois não tem ingresso suficiente");
        }
      }
      return evento; 
    });

    saveEvents(updatedEvents);

    return { ...state, users: updatedEvents };
  },

  updateReservation(state, action) {
    const { cpf, updatedReserva, id, sub} = action.payload;
    const updatedEvents = state.users.map((evento) => {
      if (evento.lista) {
        if(evento.id == id){
          //é verificado se tem ingresso suficiente caso o usuário queira mais ingressos 
          if((parseInt(evento.ingDisp) - (parseInt(updatedReserva.numIngressos) - parseInt(sub))) >= 0){
            //atualiza o número de ingressos disponíveis 
            evento.ingDisp = parseInt(evento.ingDisp) - (parseInt(updatedReserva.numIngressos) - parseInt(sub));
            //mapeia a lista de reservas para atualizar a reserva específica
            const updatedLista = evento.lista.map((reserva) =>
              reserva.cpf === cpf ? { ...reserva, ...updatedReserva } : reserva
            );
            return { ...evento, lista: updatedLista };//retorna o evento com a lista atualizada de reservas
          }else{
            Alert.alert("Ingresso Insuficiente","O usuário não foi atualizado pois não tem ingresso suficiente");
        }
        }
      }
      return evento;
    });
    //salva os users atualizados no AsyncStorage
    saveEvents(updatedEvents); 
    //retorna o estado atualizado com os users atualizados
    return { ...state, users: updatedEvents };
  },
  deleteUser(state, action) {
    console.log("ENTROU NO APAGAR USUARIO")
    const evento = action.payload;
      //filtra os users existentes para remover o evento com o ID correspondente
    const updatedEvents = state.users.filter((u) => u.id != evento.id);
    saveEvents(updatedEvents);//salva o evento atualizado no async storage 
    console.log("USUARIO DPS: " + updatedEvents)
    return {
      ...state, 
      users: updatedEvents,
    }; 
  },
  loadUsersFromStorage(state, action) {
    const loadedDecks = action.payload.users;
    return {
      ...state,
      users: loadedDecks,
    };
  },

  createEvent(state, action) {
    const evento = action.payload;
    //define um id aleatório como id
    evento.id = Math.random();
    const updatedEvents = [...state.users, evento];
    saveEvents(updatedEvents);
    console.log("salvo!");
    return {
      ...state,
      users: updatedEvents,
    };
  },
  updateEvent(state, action) {
    const updated = action.payload;
    //mapeia os users existentes no estado, substituindo o evento com o mesmo id pelo evento atualizado
    const updatedEvents = state.users.map((u) =>
      u.id === updated.id ? updated : u
    );
    saveEvents(updatedEvents);
    return {
      ...state,
      users: updatedEvents,
    };
  },
  updateSenha(state, action) {
    const updated = action.payload;
    //mapeia os users existentes no estado, substituindo o evento com o mesmo id pelo evento atualizado
    const updatedEvents = state.users.map((u) =>
      u.email === updated.email ? updated : u
    );
    console.log("senha atualizada")
    saveEvents(updatedEvents);
    return {
      ...state,
      users: updatedEvents,
    };
  },
  carregarEvents(state, action) {
    const loadedEvents = action.payload.users;
    return {
      ...state,
      users: loadedEvents,
    };
  },
  gerarRandom(state, action) {
    const loadedEvents = action.payload;
    return {
      ...state,
      users: loadedEvents,
    };
  },
};
async function deleteEvents() {
  try {
    await AsyncStorage.removeItem("users");//remove users do AsyncStorage 
    console.log("Usuarios removidos com sucesso");
  } catch (error) {//captura os erros e mostra uma mensagem de erro 
    console.error("Erro ao remover os usuarios do AsyncStorage", error);
  }
}
async function saveEvents(users) {
  try {
    //converte users para uma string JSON e salva no AsyncStorage
    console.log("Salvando no Async Storage")
    await AsyncStorage.setItem("users", JSON.stringify(users));
  } catch (error) {
    console.error("Erro ao salvar os usuarios no AsyncStorage:", error);
  }
}
async function loadEvents() {
  console.log("CARREGABDO")
  try {
    //tenta obter os users salvos no AsyncStorage
    const users = await AsyncStorage.getItem("users");
    //se users existir no AsyncStorage, converte a string JSON de 'users' para um array
    //se não, retorna um array vazio
    return { users: users ? JSON.parse(users) : [] };
  } catch (error) {
    console.error("Erro ao carregar os usuarios do AsyncStorge", error);
    return { users: [] };//retorna users vazio
  }
}
async function saveReservas(state, cpf) {
  try {
    const evento = state.users.find((u) => u.cpf === cpf);//encontra os users onde se encontra o cpf 
    if (!evento) {
      console.error("Event not found");
      return;
    }
    //salva as reservas do evento associadas ao CPF no AsyncStorage
    await AsyncStorage.setItem(
      `reservations_${cpf}`,
      JSON.stringify(evento.lista)//converte a lista de reservas em formato JSON e salva no AsyncStorage
    );
  } catch (error) {
    console.error("Error ao salvar os reservas no AsyncStorage: ", error);
  }
}

export const EventsProvider = (props) => {
  useEffect(() => {
    async function fetchData() {
      //carrega os users do AsyncStorage utilizando a função loadEvents

      const loadedEvents = await loadEvents();
      if (loadedEvents.users.length !== 0) {
      //se existirem users carregados, despacha uma ação para carregar os users no estado
        dispatch({ type: "carregarEvents", payload: loadedEvents });
      } else {        
        //se não, despacha uma ação para gerar users aleatórios
        dispatch({ type: "gerarRandom", payload: users });
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
    <EventsContext.Provider value={{ state, dispatch }}>
      {props.children}
    </EventsContext.Provider>
  );
};

export default EventsContext;
