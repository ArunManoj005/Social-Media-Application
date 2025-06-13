import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import ActivityListItem from '~/src/components/ActivityListItem';
import { useAuth } from '~/src/providers/AuthProvider';


export default function ActivityScreen() {
  const [activity, setActivity] = useState([]);
  const {token, logout} = useAuth();
  
  const router = useRouter();

  useEffect(() => {
    fetchActivity();
  }, [])

  const fetchActivity = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/activity/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      setActivity(data)
      if (!response.ok) {
         Alert.alert("Time Out","Login Again");
         await logout()
         router.replace('/login')
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  return (
    <FlatList
      data={activity}
      renderItem={({ item }) => <ActivityListItem item={item} />}
      keyExtractor={(item) => item.id}
      className="flex-1 bg-white "
    />
  );
}
