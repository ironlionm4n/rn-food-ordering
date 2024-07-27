import { useCart } from "@/app/providers/CartProvider";
import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { PizzaSize, Product } from "@/types";
import products, { defaultImage } from "@assets/data/products";
import { randomUUID } from "expo-crypto";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");
  const { onAddItem } = useCart();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Product not found</Text>
      </View>
    );
  }

  const selectedPrice = product.prices[selectedSize];

  const addToCart = () => {
    onAddItem({
      id: randomUUID(),
      product: product,
      size: selectedSize,
      price: selectedPrice || 0,
      quantity: 1,
    });

    router.push("/cart");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: product?.name,
        }}
      />
      <Image
        source={{ uri: product.image || defaultImage }}
        style={styles.image}
      />

      <View style={styles.productDetails}>
        <Text style={styles.text}>{product?.name} Pizza</Text>

        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            padding: 10,
          }}
        >
          {Object.keys(product.prices).map((size) => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "white",
                  borderWidth: 2,
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "white", fontSize: 24 }}>
                  Size: {size}
                </Text>
                <Text style={{ color: "white", fontSize: 24 }}>
                  Has Price ${product.prices[size as PizzaSize].toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  text: {
    fontSize: 32,
    color: "white",
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.tint,
    marginTop: 8,
  },
  image: {
    width: "66%",
    aspectRatio: 1,
    resizeMode: "contain",
  },
  productDetails: {
    width: "100%",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  size: {
    backgroundColor: "gainsboro",
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  sizeSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingRight: 16,
    marginVertical: 10,
  },
});

export default ProductDetailsScreen;
