import React from "react";
import { View, Image, Text, StyleSheet, Pressable } from "react-native";

import { Link } from "expo-router";

import products, { defaultImage } from "@assets/data/products";
import Colors from "@/constants/Colors";
import { Product } from "@/types";

type ProductListItemProps = {
  product: Product;
};

// asChild is a prop that is passed to the Link component, which is a boolean that determines whether the child component should be rendered as a child of the Link component or not. If asChild is true, the child component is rendered as a child of the Link component. If asChild is false, the child component is rendered as a sibling of the Link component. The default value of asChild is false.
const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    <Link href={`/menu/${product.id}`} asChild>
      <Pressable style={styles.productContainer}>
        <Image
          source={{ uri: product.image ?? defaultImage }}
          resizeMode="contain"
          style={styles.image}
        />
        <View style={styles.productDetails}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price}</Text>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.tint,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    alignSelf: "center",
  },
  productDetails: {
    display: "flex",
    alignItems: "flex-start",
    backgroundColor: "transparent",
    paddingHorizontal: 8,
    marginVertical: 10,
  },
  productContainer: {
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 18,
    flex: 1,
    justifyContent: "space-between",
    maxWidth: "50%",
  },
  linkWrapper: {
    backgroundColor: Colors.light.tint,
    borderRadius: 18,
    padding: 5,
    width: "100%",
    alignItems: "center",
  },
});

export default ProductListItem;
