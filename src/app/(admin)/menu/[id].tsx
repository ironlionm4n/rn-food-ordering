import { useCart } from "@/providers/CartProvider";
import Colors from "@/constants/Colors";
import { PizzaSize, Product } from "@/types";
import { defaultImage } from "@assets/data/products";
import { FontAwesome } from "@expo/vector-icons";
import { randomUUID } from "expo-crypto";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useProduct } from "@/api/products";

const ProductDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0] ?? ""
  );
  const router = useRouter();
  const [selectedSize] = useState<PizzaSize>("M");
  const { onAddItem } = useCart();
  const { data: product, error, isLoading } = useProduct(id);

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
          title: "Menu",
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color="white"
                    style={{
                      marginRight: 15,
                      opacity: pressed ? 0.5 : 1,
                    }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
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
                key={size}
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
