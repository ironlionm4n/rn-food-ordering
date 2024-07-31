import { View, Text, Button } from "react-native";
import React from "react";
import { supabase } from "@/lib/supabase";

const ProfileScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          color: "white",
          textTransform: "capitalize",
          fontSize: 36,
          fontWeight: "semibold",
        }}
      >
        profile
      </Text>
      <Button
        title="Sign Out"
        onPress={async () => await supabase.auth.signOut()}
      />
    </View>
  );
};

export default ProfileScreen;
