import { Product } from "@/types";
import products from "@assets/data/products";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const ProductDetailsScreen = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const product = products.find(
      (product: Product) => product.id === Number(id)
    );

    setProduct(product || null);
  }, [id]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{product?.name}</Text>
      <Text style={styles.text}>{product?.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    color: "white",
  },
});

export default ProductDetailsScreen;
