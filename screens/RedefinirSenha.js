import React, { useContext, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput } from "react-native";
import EventsContext from "../User/UserContextFile";

export default ({ route, navigation }) => {
  // Define o estado inicial para o evento e a confirmação de senha
  const [evento, setEvent] = useState({
    email: "",
    senha: "",
  });
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const { dispatch } = useContext(EventsContext);

  return (
    <View style={style.form}>
      <Text>Digite o seu endereço de email</Text>
      <TextInput
        style={[style.input, { backgroundColor: 'white' }]}
        onChangeText={(email) => setEvent({ ...evento, email })} // Atualiza o email
        placeholder="maria@exemplo.com"
        value={evento.email}
      />

      <Text>Digite a nova senha</Text>
      <TextInput
        style={[style.input, { backgroundColor: 'white' }]}
        onChangeText={(senha) => setEvent({ ...evento, senha })} // Atualiza a senha
        placeholder="********"
        secureTextEntry={true}
        value={evento.senha}
      />

      <Text>Digite novamente a senha</Text>
      <TextInput
        style={[style.input, { backgroundColor: 'white' }]}
        onChangeText={(senha) => setConfirmarSenha(senha)} // Atualiza a confirmação de senha
        placeholder="********"
        secureTextEntry={true}
        value={confirmarSenha}
      />
      
      <TouchableOpacity
        style={style.button}
        onPress={() => {
          // Verifica se todos os campos foram preenchidos
          if (evento.email && evento.senha && confirmarSenha) {
            // Verifica se as senhas coincidem
            if (evento.senha === confirmarSenha) {
              dispatch({
                // Cria ou atualiza a senha
                type: "updateSenha",
                payload: evento,
              });
              navigation.goBack();
            } else {
              Alert.alert("Senhas não coincidem", "As senhas digitadas não são iguais.");
            }
          } else {
            Alert.alert("Campos Vazios", "Por favor, preencha todos os campos.");
          }
        }}
      >
        <Text style={style.buttonText}>Verificar</Text>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  input: {
    height: 50,
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
  },
  form: {
    padding: 15,
  },
  button: {
    backgroundColor: '#219ebc',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    width: 200,
    height: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
