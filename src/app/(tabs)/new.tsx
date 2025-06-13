import { Text, View, Image, TextInput, Pressable, Alert } from "react-native"
import { useEffect, useState } from "react"
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer, VideoView } from "expo-video";

import Button from "~/src/components/Button";
import { useAuth } from "~/src/providers/AuthProvider";
import { useRouter } from "expo-router";

export default function  CreatePost() {
    const[caption, setCaption] = useState('');
    const [media, setMedia] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [hasTriedPicking, setHasTriedPicking] = useState(false);
    const [uploading, setUploading] = useState(false);

    const {token, logout} = useAuth();

    const router = useRouter()

    useEffect(()=>{
        if (!media && !hasTriedPicking) {
            pickMedia();
        }
    },[media]);

    const player = useVideoPlayer(media, player => {
        player.loop = true;
        player.play();
      });

    const pickMedia = async () => {
        
        setHasTriedPicking(true);
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        });

        if (!result.canceled) {
            if(result.assets[0].type ==='image'){
                setMediaType('image')
            } else{
                setMediaType('video')
            }
            setMedia(result.assets[0].uri)
        }
    };

    const uploadPost = async () => {
        if (!media || !mediaType || uploading) return;
        setUploading(true);

        const formData = new FormData();
        const fileName = media.split('/').pop() || `media.${mediaType === 'image' ? 'jpg' : 'mp4'}`;
        const fileType = mediaType === 'image' ? 'image/jpeg' : 'video/mp4';
    
        formData.append('media', {
            uri: media,
            name: fileName,
            type: fileType,
        } as any); 
    
        formData.append('caption', caption);
        formData.append('media_type', mediaType);
        
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/posts/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                body: formData
            });
    
            const data = await res.json();
    
            if (res.ok) {

                Alert.alert("Post Uploaded")
                router.replace("/(tabs)")

            } else {
                if(res.status === 409 || res.status === 406){
                    Alert.alert(
                        "Upload Failed",
                        `${data.detail}`,
                    );
                }else{
                    Alert.alert("Time Out","Login Again");
                    await logout()
                    router.replace('/login')
                }
            }
            setUploading(false);
        } catch (error) {
            console.error("Upload error:", error);
        }
    };
    

    return(
        <View className="p-3 items-center flex-1">
            {/* Media Picker */}
            { !media ?(
                    <View  className="w-52 aspect-[3/4] rounded-lg bg-slate-300"/>
            ) : mediaType === 'image' ? (
                <Image 
                source={{ uri: media}}
                className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
                />
            ) : (
                <VideoView 
                className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
                style={{ width: 200, aspectRatio: 1}}
                player={player} 
                allowsFullscreen 
                allowsPictureInPicture 
                />
            )}

            <Text onPress={pickMedia}  className="text-blue-500 font-semibold m-5 bg-slate-300">
                Change
            </Text>

            {/* Caption for Media */}
            <TextInput 
                value={caption}
                onChangeText={(newValue) => setCaption(newValue)} 
                placeholder="What's on your mind" 
                className="w-full p-3"
                autoCapitalize="none"
            />

            {/* Button */}
            <View className="mt-auto w-full">
            <Button 
            onPress={uploadPost} 
            title="Share" 
            disabled={uploading} 
            loading={uploading}
            />
            </View>
        </View>
    )
}