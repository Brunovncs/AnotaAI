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
import AddCard from "./screens/AddCard";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.headerImg}
              source={{
                uri: "https://assets.withfra.me/SignIn.2.png",
              }}
            />

            <Text style={styles.title}>
              Sign in to <Text style={{ color: "#075eec" }}>MyApp</Text>
            </Text>

            <Text style={styles.subtitle}>
              Get access to your portfolio and more
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email address</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={(email) => setForm({ ...form, email })}
                placeholder="john@example.com"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.email}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>

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
                  <Text style={styles.btnText}>Sign in</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.formLink}>Forgot password?</Text>
          </View>
        </KeyboardAwareScrollView>

        <TouchableOpacity
          onPress={() => {
            // handle link
          }}
          style={{ marginTop: "auto" }}
        >
          <Text style={styles.formFooter}>
            Don't have an account?{" "}
            <Text style={{ textDecorationLine: "underline" }}>Sign up</Text>
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
        <Stack.Screen name=" " component={TelaLogin} />

        <Stack.Screen
          name="Drawer"
          component={Drawer}
          options={{
            title: " ",
            headerBackVisible: false,
          }}
        />

        <Stack.Screen
          name="AddCard"
          component={AddCard}
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
    paddingVertical: 24,
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
    width: 80,
    height: 80,
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
    color: "#075eec",
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
    backgroundColor: "#075eec",
    borderColor: "#075eec",
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});
