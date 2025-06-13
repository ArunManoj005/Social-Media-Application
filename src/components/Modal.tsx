import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";

import getCloudinaryLink, { cld } from "~/src/lib/cloudinary";
import { useAuth } from '~/src/providers/AuthProvider';
import { AdvancedImage } from 'cloudinary-react-native';


interface User {
  user_id: string;
  username: string;
  profile_picture: string;
}

interface Props {
  isVisible: boolean;
  onClose: () => void;
  modalTitle: string;
}

const ListModal = ({ isVisible, onClose, modalTitle }: Props) => {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const {token, logout} = useAuth()
  
  useEffect(() => {
    if (isVisible) {
      fetchUsers();
    }

  }, [isVisible]);

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
        const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/profile/${modalTitle}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
    
        const data = await response.json();
        setUserList(data[modalTitle]);
        if (!response.ok) {
           Alert.alert("Time Out","Login Again");
           await logout()
           router.replace('/login')
        }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={{ justifyContent: 'flex-end', margin: 0 }}>
      <View className="bg-white px-5 pt-5 pb-10 rounded-t-xl max-h-[60%]">
        <Text className="text-lg font-bold text-center mb-4">
          { modalTitle == 'followers' ?
              "following"
            : "followers"
          }
        </Text>

        {loading ? (
          <Text className="text-center text-gray-500">Loading...</Text>
        ) : (
          <FlatList
            data={userList}
            keyExtractor={(item) => item.user_id}
            renderItem={({ item }) => {
              const avatar = cld.image(getCloudinaryLink(item.username,item.profile_picture))
              avatar.resize(thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face())));
              return(
                <View className="flex-row items-center py-3 border-b border-gray-100">
                  <AdvancedImage
                    cldImg={avatar}
                    className="w-12 aspect-square rounded-full" 
                  />
                  <Text className="text-base ml-3">{item.username}</Text>
                </View>
              )
            }}
            ListEmptyComponent={
              <Text className="text-center text-gray-400 mt-4">No users found</Text>
            }
          />
        )}

        <TouchableOpacity onPress={onClose} className="mt-4 items-center">
          <Text className="text-red-500 font-semibold text-base">Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ListModal;
