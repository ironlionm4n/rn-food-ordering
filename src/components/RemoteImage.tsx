import { Image, StyleSheet } from "react-native";
import React, { ComponentProps, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
} & Omit<ComponentProps<typeof Image>, "source">;

const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!path) return;
    const getImage = async () => {
      setImage("");
      const { data, error } = await supabase.storage
        .from("product-images")
        .download(path);

      if (error) {
        console.error("Error downloading image", error);
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onloadend = () => {
          setImage(fr.result as string);
        };
      }
    };

    getImage();
  }, [path]);

  return <Image source={{ uri: image || fallback }} {...imageProps} />;
};

export default RemoteImage;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
});
