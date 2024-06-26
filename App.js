import React, { useState, useContext, useEffect} from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Drawer from "./Drawer/Drawer";
import AddDeck from "./screens/AddDeck";
import Cadastro from "./screens/Cadastro";
import EventsContext, { EventsProvider } from "./User/UserContextFile";
import RedefinirSenha from "./screens/RedefinirSenha";
import DecksContext, {DecksProvider} from "./Decks/DeckContextFile";
import AddCard from "./screens/AddCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditCard from "./screens/EditCard";
import { useIsFocused, useRoute } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

function TelaLogin() {;
  // AsyncStorage.clear();
  // console.log("console limpado")

  const route = useRoute(); // Adicionado para acessar os parâmetros da rota


  const { state, dispatch } = useContext(EventsContext);
  const isFocused = useIsFocused()
  const [users, setUsers] = useState(state.users);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigation = useNavigation();
  // Function to handle sign-in]

  console.log("USUARIOS" + state.users); 


  useEffect(() => {
    async function fetchDecks() {
      try {
        const savedDecks = await AsyncStorage.getItem("users");

        // console.log(state.decks)
        const users = savedDecks ? JSON.parse(savedDecks) : [];
        
        
        dispatch({ type: "loadUsersFromStorage", payload: { users } });
      } catch (error) {
        console.error("Erro ao carregar os decks do AsyncStorage", error);
      }
    }

    if (isFocused) {
      fetchDecks();
    }
  }, [isFocused]);


  const handleSignIn = () => {
    const user = state.users.find(
      (u) => u.email === form.email && u.senha === form.password
    );
    if (user) {
      console.log("ID USUARIO: " + user.id)
      navigation.navigate("Drawer", {userId: user.id, user: user});
      setForm({ email: "", password: "" }); // Limpa os campos de entrada após o login

    } else {
      Alert.alert("Erro", "Email ou senha errados!");
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffeaa7" }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.headerImg}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/889/889648.png",
              }}
            />

            <Text style={styles.title}>
              A<Text style={styles.notecolor}>nota</Text>AI!
            </Text>

            <Text style={styles.subtitle}>
              O seu próprio aplicativo de flashcards
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Endereço de email</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={(email) => setForm({ ...form, email })}
                placeholder="maria@exemplo.com"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.email}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Senha</Text>

              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(password) => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.password}
              />
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleSignIn}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Entrar</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* <Text style={styles.formLink}>Esqueceu a senha?</Text> */}

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("RedefinirSenha");
              }}
            >
              <Text style={styles.formLink}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Cadastro");
          }}
          style={{ marginTop: "auto" }}
        >
          <Text style={styles.formFooter}>
            Não possui uma conta?{" "}
            <Text style={{ textDecorationLine: "underline" }}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <EventsProvider>
      <DecksProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen
            name="TelaLogin"
            component={TelaLogin}
            // options={{
            //   headerShown: false,
            // }}
            options={({ navigation }) => {
              useContext(EventsContext);
              const { dispatch } = useContext(EventsContext);
              return {
                headerShown: false,
              };
            }}
          />

          <Stack.Screen
            name="Drawer"
            component={Drawer}
            options={{
              title: " ",
              headerBackVisible: false,
              headerShown: false,
            }}
          />
          
          {/* <Stack.Screen
            name="AddDeck"
            component={AddDeck}
            options={{
              title: "Adicionar Carta"
            }}
          /> */}
            <Stack.Screen
            name="AddDeck"
            component={AddDeck}
            options={({ navigation }) => {
              useContext(DecksContext);
              const { dispatch } = useContext(DecksContext);
              return {
                title: "Adicionar Deck",
              };
            }}
          /> 
          <Stack.Screen
            name="Cadastro"
            component={Cadastro}
            options={({ navigation }) => {
              useContext(EventsContext);
              const { dispatch } = useContext(EventsContext);
              return {
                title: "Cadastrar Usuário",
              };
            }}
          />

          <Stack.Screen
            name="RedefinirSenha"
            component={RedefinirSenha}
            options={({ navigation }) => {
              useContext(EventsContext);
              const { dispatch } = useContext(EventsContext);
              return {
                title: "Redefinir Senha",
              };
            }}
          />

        <Stack.Screen
            name="AddCard"
            component={AddCard}
            options={({ navigation }) => {
              useContext(DecksContext);
              const { dispatch } = useContext(DecksContext);
              return {
                title: "Adicionar Carta",
              };
            }}
          /> 

        <Stack.Screen
            name="EditCard"
            component={EditCard}
            options={({ navigation }) => {
              useContext(DecksContext);
              const { dispatch } = useContext(DecksContext);
              return {
                title: "Editar Carta",
              };
            }}
          /> 

        </Stack.Navigator>
      </NavigationContainer>
      </DecksProvider>
    </EventsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 90,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  notecolor: {
    color: "#d63031",
  },
  title: {
    fontSize: 31,
    fontWeight: "700",
    color: "#1D2A32",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 36,
  },
  headerImg: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 36,
  },
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff7675",
    textAlign: "center",
  },
  formFooter: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
    letterSpacing: 0.15,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    borderWidth: 1,
    borderColor: "#C9D3DB",
    borderStyle: "solid",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#ff7675",
    borderColor: "#ff7675",
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});

const screenOptions = {
  headerStyle: {
    backgroundColor: "#e17055",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};
