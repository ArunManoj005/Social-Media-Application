import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, View} from "react-native"
import { AntDesign} from "@expo/vector-icons"

import { AdvancedImage } from 'cloudinary-react-native';
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";

import getCloudinaryLink, { cld } from "~/src/lib/cloudinary";
import PostContent from "~/src/components/PostContent";
import { useAuth } from "~/src/providers/AuthProvider";


export default function PostListItem({ post }: any) {
    const [isLiked, setIsLiked] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [likesCount, setLikesCount] = useState<number>(post.likes_count);

    const {token, logout} = useAuth()
    const router = useRouter();

    useEffect(() => {
        if(post.isLiked){
            setIsLiked(true);
        }
    },[post.isLiked]);


    useEffect(() => {
        if (hasInteracted){
            if (isLiked) {
                setLikesCount(prev => prev + 1);
                saveLike();
            } else {
                setLikesCount(prev => Math.max(0, prev - 1));
                deleteLike();
            }
        }
    }, [isLiked]);

    const saveLike = async () => {
        try {
            const formBody = new FormData()
            formBody.append('post_id',post.id)
            const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/posts/like`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
              },
              body:formBody
            });
            if (!response.ok) {
              Alert.alert("Time Out", "Login Again");
              await logout();
              router.replace('/login');
            }
        
          } catch (error) {
            console.error("Error liking the post:", error);
          }
    }

    const deleteLike = async () => {
        try {
            const formBody = new FormData()
            formBody.append('post_id',post.id)
            const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/posts/unlike`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
              },
              body:formBody
            });
            if (!response.ok) {
              Alert.alert("Time Out", "Login Again");
              await logout();
              router.replace('/login');
            }
        
          } catch (error) {
            console.error("Error liking the post:", error);
          }
    }

    const handleLikeToggle = () => {
        setIsLiked(!isLiked);
        setHasInteracted(true);
    };

    const avatar = cld.image(getCloudinaryLink(post.username, post.user_profile_picture))
    avatar.resize(thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face())));

    return(
        <View className="bg-white">
            {/* Header*/}
            <View className="p-3 flex-row items-center gap-2">
                <AdvancedImage
                  cldImg={avatar}
                  className="w-12 aspect-square rounded-full" 
                />
                <Text className="font-semibold">{post.username}</Text>
            </View>

            <PostContent post={post} />

            <View className="flex-row gap-3 p-3">
                <AntDesign 
                onPress={() => {handleLikeToggle()}}
                name={ isLiked ? "heart" : "hearto"} 
                color={isLiked ? 'crimson' : 'black'}
                size={25} 
                />
            </View>
            <View className="px-3 g-2">
                <Text className="font-semibold"> {likesCount} likes</Text>
                <Text >
                    <Text className="pr-5 font-semibold">{post.username}</Text>
                    {post.caption}
                </Text>

            </View>
        </View>
        
    )
}