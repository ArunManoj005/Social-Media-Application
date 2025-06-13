import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Auth = {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  login: (token: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<Auth>({
  isAuthenticated: false,
  token: null,
  username: null,
  login: async () => {},
  logout: async () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedUsername = await AsyncStorage.getItem('username');

        if (storedToken && storedUsername) {
          setToken(storedToken);
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsReady(true);
      }
    };

    loadAuthData();
  }, []);

  const login = async (newToken: string, newUsername: string) => {
    try {
      await AsyncStorage.setItem('authToken', newToken);
      await AsyncStorage.setItem('username', newUsername);
      setToken(newToken);
      setUsername(newUsername);
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('username');
      setToken(null);
      setUsername(null);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        username,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
