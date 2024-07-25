import {
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";

import products from "../../../assets/data/products";
import Colors from "@/constants/Colors";
import ProductListItem from "@/components/ProductListItem";

export default function TabOneScreen() {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductListItem key={item.id} product={item} />
      )}
    ></FlatList>
  );
}
