import { Cloudinary } from "@cloudinary/url-gen";

export  const cld = new Cloudinary({
    cloud: {
        cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
    }
});

export default function getCloudinaryLink(username: any, public_id: string){
    if(public_id === 'user_default'){
        return `deepmark/${public_id}`;
    }
    return `deepmark/${username}/${public_id}`; 
}