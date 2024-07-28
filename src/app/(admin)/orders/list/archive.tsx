import { StyleSheet, FlatList } from "react-native";
import React, { Component } from "react";
import orders from "@assets/data/orders";
import OrderListItem from "@/components/OrderListItem";
import { Stack } from "expo-router";

export default function OrdersScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Archive" }} />
      <FlatList
        data={orders}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        renderItem={({ item }) => <OrderListItem order={item} />}
      />
    </>
  );
}

const styles = StyleSheet.create({});
