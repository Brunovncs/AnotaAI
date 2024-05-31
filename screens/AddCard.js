import React, { useContext, useState } from "react";
import { View, Alert, FlatList, StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";
import { DecksContext } from "../Decks/DeckContextFile";
import { ListItem, Avatar, Icon, Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

export default () => {
  const { state, dispatch } = useContext(DecksContext);
  const navigation = useNavigation();
  const [perguntaText, setPerguntaText] = useState('');
  const [respostaText, setRespostaText] = useState('');

  return (
    <View style={styles.container}>
      {/* Centered Text Input for Perguntas */}
      <TextInput
        style={[styles.input, {backgroundColor: 'white'}]} // White background for this input
        onChangeText={text => setPerguntaText(text)}
        value={perguntaText}
        placeholder="Digite suas perguntas aqui"
      />
      {/* Centered Text Input for Respostas */}
      <TextInput
        style={[styles.input, {backgroundColor: 'white'}]} // White background for this input
        onChangeText={text => setRespostaText(text)}
        value={respostaText}
        placeholder="Digite suas respostas aqui"
      />
      {/* Centered Round Border Button */}
      <TouchableOpacity onPress={() => alert('Texto adicionado')} style={styles.addButton}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b2bec3",
    //justifyContent: 'center', // Center items vertically
    alignItems: 'center', // Center items horizontally
  },
  input: {
    height: 50, // Smaller size
    marginVertical: 10,
    padding: 10,
    borderRadius: 5, // More rounded borders
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%', // Make the input take up less space
  },
  addButton: {
    backgroundColor: '#219ebc',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20, // More rounded corners
    width: 200, // Smaller size
    height: 40,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
