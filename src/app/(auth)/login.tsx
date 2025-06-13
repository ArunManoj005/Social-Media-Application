import { View, Text,Image,TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import {StatusBar} from 'expo-status-bar'
import { TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';//error occurin line while importing
import { FadeInDown } from 'react-native-reanimated';
import { useRouter } from "expo-router";

import { useAuth } from '~/src/providers/AuthProvider';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth()

  const validate = async () =>{
    if(username.trim() === '' || password.trim() === ''){
      Alert.alert(`Values can't be empty`)
    }else{
      try {
        const formBody = new URLSearchParams({
          username: username,
          password: password,
        }).toString();

        const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/auth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body:formBody
        });
    
        const data = await response.json();
        if (!response.ok) {
          Alert.alert("Login Failed", data.detail || "Incorrect credentials");
          return;
        }
    
        Alert.alert(
          "Login Successfull",
          `Welcome to DeepMark ${data.username}`,
          [
              {
                  text: "Cancel",
                  style: "cancel",
                  onPress: () =>{
                    setPassword('')
                    setUsername('')
                  }
              },
              {
                  text: "OK",
                  onPress: async () => {
                    await login(data.access_token, data.username)
                    router.replace("/(tabs)");
                  }
              }
          ]
      );
        
    
      } catch (error) {
        console.error("Login error:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  }

  const router = useRouter();

  return (
    <View className="bg-white h-full w-full">
        <StatusBar style="light"/>
        <Image className="h-full w-full absolute" source={require('~/assets/images/background.jpg')}></Image>
        {/*lights*/}
        <View className="flex-row justify-around w-full absolute">
            <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className="h-[225] w-[90]" source={require('~/assets/images/light.png')}/>
            <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify()}className="h-[160] w-[65]" source={require('~/assets/images/light.png')}/>
        </View>

        <View className="h-full w-full flex justify-around pt-40 pb-10">
            <View className="flex items-center">
                <Animated.Text entering={FadeInUp.duration(1000).springify()}className="text-white font-bold tracking-wider text-5xl">
                    Login
                </Animated.Text>

            </View>

            <View className="flex items-center mx-4 space-y-4">
                <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-slate-500/20 p-4 rounded-2xl w-full m-2">

                <TextInput 
                placeholder='Username' 
                placeholderTextColor="#d1d5db"
                autoCapitalize="none"
                autoCorrect={false}
                value={username}
                style={{ color: 'white' }}
                onChangeText={(newValue) => setUsername(newValue)}
                />
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-slate-500/20 p-4 rounded-2xl w-full mb-3 m-2">

                <TextInput
                placeholder='Password'
                placeholderTextColor="#d1d5db"
                onChangeText={(newValue) => setPassword(newValue)}
                style={{ color: 'white' }} 
                value={password}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                />

                </Animated.View>
                <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="w-full">
                    <TouchableOpacity className="w-full bg-sky-400 p-3 rounded-2xl mb-3 mt-2">
                        <Text 
                        className="text-xl font-bold text-white text-center"
                        onPress={() => validate()}
                        >
                          Login
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="flex-row justify-center">
                    <Text
                  style={{ color: 'white' }}>Don't have an account?</Text>
                    <TouchableOpacity onPress={()=>router.replace("/(auth)/signup")}>
                        <Text className="text-sky-600">SignUp</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>

    </View>
  )
}