import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from 'react-native';
import Drawer from './Drawer/Drawer';

export default function App() {
  return (
    <SafeAreaView style = {{flex:1}}>
      <NavigationContainer>
        <Drawer></Drawer>
      </NavigationContainer>
    </SafeAreaView>
  );
}
