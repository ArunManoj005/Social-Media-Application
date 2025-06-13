import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';


import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { AdvancedImage } from 'cloudinary-react-native';

import ListModal from '~/src/components//Modal';
import { useAuth } from '~/src/providers/AuthProvider';
import getCloudinaryLink, { cld } from '~/src/lib/cloudinary';


export default function ProfileHeader({username}: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState<any>('');
  const [user, setUser] = useState<any>([]);
  const {token, logout} = useAuth();

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
      setUser(data)
      if (!response.ok) {
         Alert.alert("Time Out","Login Again");
         await logout()
         router.replace('/login')
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };


  const openModal = (title: string) => {
    setModalTitle(title);
    setModalVisible(true);
  };

  const router = useRouter();
  
  const avatar = cld.image(getCloudinaryLink(username, user.profile_picture))
  avatar.resize(thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face())));
  return (
    <View className="items-center pt-10 pb-5">
      <View className="flex-row items-center w-[90%] justify-start">
        <AdvancedImage
          cldImg={avatar}
          className="w-24 h-24 rounded-full"
        />
        <View className="flex-row ml-5 space-x-4">
          <TouchableOpacity onPress={() => openModal('following')}>
            <View className="items-center pl-5">
              <Text className="text-lg font-bold">{user.following_count}</Text>
              <Text className="text-sm text-gray-500">Followers</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openModal('followers')}>
            <View className="items-center pl-5">
              <Text className="text-lg font-bold">{user.followers_count}</Text>
              <Text className="text-sm text-gray-500">Following</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-xl font-bold mt-3 self-start ml-5">{username}</Text>
      <Text className="text-sm text-gray-500 mt-1 self-start ml-5">
        {user.bio}
      </Text>

      <TouchableOpacity
        className="mt-4 bg-blue-500 py-2 px-4 rounded-md self-start ml-5"
        onPress={() => router.push('/edit')}
      >
        <Text className="text-white font-bold">Edit Profile</Text>
      </TouchableOpacity>

      <ListModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        modalTitle={modalTitle}
      />
    </View>
  )
}
