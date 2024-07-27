import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useCart } from "./providers/CartProvider";
import { defaultImage } from "@assets/data/products";
import Colors from "@/constants/Colors";
import Button from "@/components/Button";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import CartListItem from "@/components/CartListItem";

const CartScreen = () => {
  const { items, total } = useCart();

  if (items.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          marginBottom: 100,
        }}
      >
        <Text style={{ fontSize: 40, color: "white" }}>Your cart is empty</Text>
        <FontAwesome name="frown-o" size={100} color="white" />
      </View>
    );
  }

  return (
    <View style={{ padding: 10 }}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <CartListItem cartItem={item} key={item.id} />
        )}
        contentContainerStyle={{ gap: 10 }}
      />
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      <Button text="Checkout" />
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  cartItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 5,
    flex: 1,
  },
  text: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  qty: {
    color: Colors.light.tint,
    fontSize: 20,
    fontWeight: "500",
  },
  image: {
    width: 75,
    aspectRatio: 1,
  },
  total: {
    fontSize: 24,
    color: Colors.light.tint,
    fontWeight: "bold",
  },
});
