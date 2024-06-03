import React, { useContext, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Button } from "@rneui/themed";
import { TextInput, Platform } from "react-native";
import EventsContext from "../User/UserContextFile";
import DateTimePicker from "@react-native-community/datetimepicker";

export default ({ route, navigation }) => {
  //recebe os parâmetros e define que o evento novo não é favoritado
  const [evento, setEvent] = useState({
    email: "",
    senha: "",
  });

  const { dispatch } = useContext(EventsContext);

  return (
    <View style={style.form}>
      <Text>Email</Text>
      <TextInput
        style={[style.input, {backgroundColor: 'white'}]}
        onChangeText={(email) => setEvent({ ...evento, email })} //atualiza o nome do evento
        placeholder="maria@exemplo.com"
        value={evento.email}
      />

      <Text>Senha</Text>
      <TextInput
        style={[style.input, {backgroundColor: 'white'}]}
        onChangeText={(senha) => setEvent({ ...evento, senha })} //atualiza o local do evento
        placeholder="********"
        value={evento.senha}
        secureTextEntry={true}

      />
    <TouchableOpacity
      style={style.button}
      onPress={() => {
        // Verifica se todos os campos foram preenchidos
        if (evento.email && evento.senha) {
          dispatch({
            // Cria ou atualiza o evento
            type: evento.id ? "updateEvent" : "createEvent",
            payload: evento,
          });
          navigation.goBack();
        } else {
          Alert.alert(
            "Campos Vazios",
            "Por favor, preencha todos os campos."
          );
        }
      }}
    >
      <Text>Salvar</Text>
    </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
    input: {
        height: 50, // Smaller size
        marginVertical: 10,
        padding: 10,
        borderRadius: 5, // More rounded borders
        borderWidth: 1,
        borderColor: '#ccc',
        width: '80%', // Make the input take up less space
      },
  form: {
    padding: 15,
    //backgroundColor: "#ffeaa7",
  },
  button: {
    backgroundColor: '#219ebc',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20, // More rounded corners
    width: 200, // Smaller size
    height: 40,
  }
});
