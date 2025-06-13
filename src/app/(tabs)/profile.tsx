import { Text, View, TouchableOpacity, Alert} from "react-native"
import { router } from "expo-router";

import { useAuth } from "~/src/providers/AuthProvider";
import ProfileHeader from "~/src/components/ProfileHeader";
import ProfilePostGrid from "~/src/components/ProfilePostGrid";


export default function ProfileScreen() {
    const { username, logout } = useAuth();

    const signout = async () =>{
        Alert.alert(
            "Logout",
            "Do you want to Logout!!",
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
                        await logout()
                        router.replace("/(auth)")
                    }
                }
            ]
        )
    }
    return(
        <View className="flex-1 bg-white">
            <TouchableOpacity
            className="absolute top-[60px] right-5 bg-red-600 py-1.5 px-3 rounded-md z-10"
            onPress={signout}
            >
            <Text className="text-white font-bold">Logout</Text>
            </TouchableOpacity>

            <ProfileHeader username={username}/>
            <ProfilePostGrid username={username}/>
        </View>
    )
}