import { router, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '~/src/providers/AuthProvider';

export default function EditProfileScreen() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [initialName, setInitialName] = useState('');
  const [initialBio, setInitialBio] = useState('');

  const{ token, username, logout } = useAuth()

  useEffect(()=>{
    fetchProfile();
  },[])

  const fetchProfile = async ()=>{
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      setName(data.name);
      setBio(data.bio);
      setInitialName(data.name);
      setInitialBio(data.bio);

      if (!response.ok) {
         Alert.alert("Time Out","Login Again");
        //  await logout()
        //  router.push('/login')
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  const router = useRouter();

  const handleSubmit = async () => {
    if( bio === initialBio && name === initialName){
      Alert.alert(
        "No Updates",
        ``,
        [
            {
                text: "Cancel",
                style: "cancel",
                onPress: () =>{
                }
            },
            {
                text: "OK",
                onPress: async () => {
                  router.back();
                }
            }
        ]
      );
    }
    else{
      try {
        const formBody = new FormData()
        formBody.append("name", name);
        formBody.append("bio", bio);
        const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/auth/${username}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body:formBody
        });
    
        if (response.status === 204) {
          Alert.alert("Profile Updated");
          router.replace("/profile");
        } else {
          const data = await response.json();
          if (!response.ok) {
            Alert.alert("Time Out", "Login Again");
            await logout();
            router.replace('/login');
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  };

  return (
    <View className="flex-1 bg-white p-5 justify-center">
      <Text className="text-xl font-bold text-center mb-5">Edit Profile</Text>

      <TextInput
        className="h-12 border border-gray-300 rounded-lg px-3 text-base mb-4"
        placeholder="Enter Username"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        className="h-12 border border-gray-300 rounded-lg px-3 text-base mb-6"
        placeholder="Enter Bio"
        value={bio}
        onChangeText={setBio}
        autoCapitalize="none"
      />

      <TouchableOpacity
        className="bg-blue-500 py-3 rounded-lg items-center"
        onPress={handleSubmit}
      >
        <Text className="text-white font-bold text-base">Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}
