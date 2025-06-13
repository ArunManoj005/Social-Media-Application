import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, FlatList, useWindowDimensions, Alert } from 'react-native';

import { AdvancedImage, AdvancedVideo } from "cloudinary-react-native";
import { thumbnail, scale } from "@cloudinary/url-gen/actions/resize";

import getCloudinaryLink, { cld } from "~/src/lib/cloudinary";
import { useAuth } from '~/src/providers/AuthProvider';

const numColumns = 3;
export default function PostGrid({username} : any) {
    const [posts, setPosts] = useState<any>([])
    const { width }= useWindowDimensions();
    const imageSize = width / numColumns;

    const {token, logout} = useAuth();

    useEffect(() =>{
        fetchUserPosts();
    },[])

    const router = useRouter();

    const fetchUserPosts = async () =>{
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/posts/user`, {
              method: "POST",
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
    }
    
    return (
        <FlatList
        data={posts}
        renderItem={({ item }) => {
            const post_link = getCloudinaryLink(username, item.media_url)
            return (
                <View className="flex-1 m-[1px]">
                    {item.media_type === 'video' ? (
                        <AdvancedVideo
                        cldVideo={cld.video(post_link).resize(scale().width(400))}
                        videoStyle={{ width: imageSize, height: imageSize}}
                        />
                        ) : (
                        <AdvancedImage
                            cldImg={
                                cld.image(post_link).resize(thumbnail().width(width).height(width))
                            }
                            style={{ width: imageSize, height: imageSize }}
                            className="w-full h-full"
                        />
                    )}
                </View>
            );
        }}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        className="flex-1 bg-white mt-5"
        />
    );
}
