import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import products from "../../assets/data/products";
import Colors from "@/constants/Colors";
import { Product } from "@/types";

type ProductListItemProps = {
  product: Product;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    <View style={styles.productContainer}>
      <Image
        source={{ uri: product.image }}
        resizeMode="contain"
        style={styles.image}
      />
      <View style={styles.productDetails}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </View>
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
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  productContainer: {
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 18,
    margin: 10,
  },
});

export default ProductListItem;
