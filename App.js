// import React from 'react';
// import { NavigationContainer } from "@react-navigation/native";
// import { SafeAreaView } from 'react-native';
// import Drawer from './Drawer/Drawer';

// export default function App() {
//   return (
//     <SafeAreaView style = {{flex:1}}>
//       <NavigationContainer>
//         <Drawer></Drawer>
//       </NavigationContainer>
//     </SafeAreaView>
//   );
// }

//TELA LOGIN
import React, { useState } from "react";
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
import users from "./users"; // Import the users list
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Drawer from "./Drawer/Drawer";
import AddDeck from "./screens/AddDeck";

const Stack = createNativeStackNavigator();

function TelaLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigation = useNavigation();
  // Function to handle sign-in
  const handleSignIn = () => {
    const user = users.find(
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

            <Text style={styles.formLink}>Esqueceu a senha?</Text>
          </View>
        </KeyboardAwareScrollView>

        <TouchableOpacity
          onPress={() => {
            // handle link
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
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
        name=" "
        component={TelaLogin}
        options={{
          headerShown: false,
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
            title: "Adicionar Carta",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
