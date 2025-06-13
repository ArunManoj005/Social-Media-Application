import { AdvancedImage, AdvancedVideo } from "cloudinary-react-native";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { useWindowDimensions } from "react-native";

import getCloudinaryLink, { cld } from "~/src/lib/cloudinary";

export default function PostContent({ post }: any){
    const { width } = useWindowDimensions();
    const post_link = getCloudinaryLink(post.username, post.media_url)
    if(post.media_type === 'image'){
        const image = cld.image(post_link);
        image.resize(scale().width(width));

        return(
            <AdvancedImage cldImg={image} className="w-full aspect-square"/>
        )
    }
    if(post.media_type === 'video'){
        const video = cld.video(post_link);
        video.resize(scale().width(400));
        return(
             <AdvancedVideo 
                cldVideo={video} 
                videoStyle={{ width: '100%', aspectRatio: 4 / 3}} 
            />
        )
    }
}