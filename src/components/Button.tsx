import { Pressable, Text } from "react-native";
import { ActivityIndicator } from "react-native";

type ButtonProps = {
    title: string,
    onPress?: () => void,
    disabled?: boolean,
    loading?: boolean
}

export default function Button({ title, onPress, disabled = false, loading = false }: ButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            className={`w-full p-3 items-center rounded-md ${disabled || loading ? 'bg-blue-300' : 'bg-blue-500'}`}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text className="text-white font-semibold">
                    {title}
                </Text>
            )}
        </Pressable>
    )
}
