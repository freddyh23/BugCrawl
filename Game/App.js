import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from "@react-navigation/stack";


import Login from "./src/Login";
import GameLoop from "./src/GameLoop";
import StackNavigator from "@react-navigation/stack/src/navigators/createStackNavigator";


const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          {/*<Stack.Screen name="Login" component={Login}/>*/}
          <Stack.Screen name="GameLoop" component={GameLoop}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
