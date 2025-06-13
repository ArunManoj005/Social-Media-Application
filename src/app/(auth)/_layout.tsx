import { Redirect, Stack} from "expo-router";

import { useAuth } from "~/src/providers/AuthProvider";

export default function AuthLayout(){
    let {isAuthenticated} = useAuth()
    if(isAuthenticated){
        return <Redirect href='/(tabs)' />
    }
    return (
        <Stack>
            <Stack.Screen 
                name="login"
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="signup"
                options={{ headerShown: false }}
            />
        </Stack>
    )

}