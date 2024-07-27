import { useCart } from "@/app/providers/CartProvider";
import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { PizzaSize, Product } from "@/types";
import products, { defaultImage, sizes } from "@assets/data/products";
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
      <View>
        <Text style={styles.text}>Select Size</Text>
        <View style={styles.sizeSelector}>
          {sizes.map((size) => (
            <Pressable
              key={size}
              onPress={() => setSelectedSize(size)}
              style={[
                styles.size,
                {
                  backgroundColor:
                    selectedSize === size ? Colors.light.tint : "white",
                },
              ]}
            >
              <Text
                style={[
                  styles.sizeText,
                  { color: selectedSize === size ? "white" : "black" },
                ]}
              >
                {size}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.text}>{product?.name} Pizza</Text>
        <Text style={styles.price}>${selectedPrice}</Text>
        <Button text="Add to Cart" onPress={addToCart} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 24,
    color: "white",
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.tint,
    marginTop: 8,
  },
  image: {
    width: "90%",
    aspectRatio: 1,
    resizeMode: "contain",
  },
  productDetails: {
    width: "100%",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
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
