import React, { useState, useContext } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert, // Import Alert
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import users from "./User/users"; // Import the users list
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Drawer from "./Drawer/Drawer";
import AddDeck from "./screens/AddDeck";
import Cadastro from "./screens/Cadastro";
import EventsContext, { EventsProvider } from "./User/UserContextFile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RedefinirSenha from "./screens/RedefinirSenha";

const Stack = createNativeStackNavigator();

function TelaLogin() {
  // AsyncStorage.clear();
  // console.log("console limpado")
  const { state, dispatch } = useContext(EventsContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigation = useNavigation();
  console.log("numero de usuarios"+ state.users.length);
  // Function to handle sign-in]

  console.log(state.users); // Print the users array to the console

  const handleSignIn = () => {
    const user = state.users.find(
      (u) => u.email === form.email && u.senha === form.password
    );
    if (user) {
      navigation.navigate("Drawer");
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
              A<Text style={{ color: "#d63031" }}>nota</Text>AI!
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
          

          <Stack.Screen
            name="AddDeck"
            component={AddDeck}
            options={{
              title: "Adicionar Carta"
            }}
          />

          <Stack.Screen
            name="Cadastro"
            component={Cadastro}
            options={({ navigation }) => {
              useContext(DecksContext);
              const { dispatch } = useContext(DecksContext);
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
        </Stack.Navigator>
      </NavigationContainer>
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
