import React, { useState } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import { StackActions } from '@react-navigation/native';
// import GameLoop from "./GameLoop";
import TouchableOpacity from "react-native-web/src/exports/TouchableOpacity";

const Login = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View>
            <Text>Email </Text>
            <TextInput
                placeholder="email..."
                onChangeText={text => {
                    setEmail(text);
                }}
            />
            <Text>Password </Text>
            <TextInput
                placeholder="..."
                secureTextEntry={true}
                onChangeText={text => {
                    setPassword(text);
                }}
            />
            <Button
                title="Go to Details"
                onPress={() =>{
                    if(email === "Freddy" && password === "password") {
                        navigation.dispatch(
                            StackActions.replace('GameLoop')
                        )
                    }
                }}
            />
            {/*<TouchableOpacity/>*/}

            <Text> Text: {email} password: {password} </Text>
        </View>
    );
};

export default Login;
