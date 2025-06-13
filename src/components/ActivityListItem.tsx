import { View, Text, Image } from "react-native";

import { AdvancedImage } from 'cloudinary-react-native';
import { thumbnail, scale } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { format } from "@cloudinary/url-gen/actions/delivery";

import getCloudinaryLink, { cld } from "~/src/lib/cloudinary";

export default function ActivityListItem({ item }: any) {
  let activityText = "";
  let postThumbnail = "";
  let userAvatar = "";
  let thumbnailImage;

  if (item.liked_post_id) {
    activityText = `${item.sender_name} liked your post.`;
    userAvatar = getCloudinaryLink(item.sender_name,item.liked_user_profile_picture);
    postThumbnail = getCloudinaryLink(item.receiver_name,item.liked_post_url);
  } else if (item.detected_post_id) {
    activityText = `${item.sender_name} tried to repost your post.`;
    userAvatar = getCloudinaryLink(item.sender_name,item.detected_user_profile_picture);
    postThumbnail = getCloudinaryLink(item.receiver_name,item.detected_post_url);
  } else if (item.receiver_name) {
    activityText = `${item.sender_name} started following You.`;
    userAvatar = getCloudinaryLink(item.sender_name,item.followed_profile_picture);
    postThumbnail = "";
  }

  const avatar = cld.image(userAvatar)
  avatar.resize(thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face())));

  if(item.media_type === 'video'){
    const post = cld.video(postThumbnail)
    thumbnailImage = post.delivery(format("jpg")).resize(thumbnail().width(400).height(300));
  }
  else{
    const post = cld.image(postThumbnail)
    thumbnailImage = post.resize(thumbnail().width(400).height(300));
  }

  return (
    <View className="flex-row items-center px-4 py-3 border-b border-gray-300 bg-white">
      <AdvancedImage
        cldImg={avatar}
        className="w-12 aspect-square rounded-full" 
      />

      <View className="flex-1">
        <Text className=" ml-2 text-base text-gray-800">{activityText}</Text>
      </View>

      {postThumbnail ? (
        <AdvancedImage
          cldImg={thumbnailImage}
          className="w-12 h-12 ml-3 " 
        />
      ) : null}
    </View>
  );
}
