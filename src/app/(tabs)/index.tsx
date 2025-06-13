import { useEffect, useState } from "react"
import { FlatList, View, Text, Image, TouchableOpacity, Alert} from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { AdvancedImage } from 'cloudinary-react-native';

import PostListItem from "~/src/components/PostListItem"
import { useAuth } from "~/src/providers/AuthProvider";
import getCloudinaryLink, { cld } from "~/src/lib/cloudinary";

export default function FeedScreen() {
   const [profilePicture, setProfilePicture] = useState('')
   const [posts, setPosts] = useState([]);
   const {token, username, logout} = useAuth()

   useEffect(() => {
        getProfile();
        fetchPosts();
   }, [])

   const getProfile = async () => {
     try {
       const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/auth/profile`, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`,
         },
       });
   
       const data = await response.json();
       if (!response.ok) {
          Alert.alert("Time Out","Login Again");
          await logout()
          router.replace('/login')
       }
       setProfilePicture(data.profile_picture)
     } catch (error) {
       console.error("Error fetching profile:", error);
     }
   };
   
   const fetchPosts = async () => {
        try {
          const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/posts/feed`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
      
          const data = await response.json();
          if (!response.ok) {
            Alert.alert("Time Out","Login Again");
            await logout()
            router.replace('/login')
          }
          setPosts(data)
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
   };

   const router = useRouter()

   const avatar = cld.image(getCloudinaryLink(username, profilePicture))
   avatar.resize(thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face())));

   return(
     <View className="flex-1 bg-white">
          {/* Header Section */}
          <View className="p-2 border-b border-gray-300">
          <View className="flex-row justify-between items-center py-4">
          <View className="flex-row items-center">
               <AdvancedImage
                  cldImg={avatar}
                  className="w-12 aspect-square rounded-full" 
                />
               <Text className="pl-2 text-lg font-bold">{username}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/activity')}>
               <Ionicons name="heart-outline" size={28} color="black" />
          </TouchableOpacity>
          </View>
          </View>
     
          {/* Feed */}
          <FlatList
          data={posts}
          renderItem={({ item }) => <PostListItem post={item} />}
          contentContainerStyle={{ gap: 10, maxWidth: 512, alignSelf: 'center', width: '100%' }}
          showsVerticalScrollIndicator={false}
          />
     </View>
   
   )
}