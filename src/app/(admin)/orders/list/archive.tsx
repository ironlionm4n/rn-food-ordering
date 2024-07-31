import { StyleSheet, FlatList, ActivityIndicator, Text } from "react-native";
import React, { Component } from "react";
import orders from "@assets/data/orders";
import OrderListItem from "@/components/OrderListItem";
import { Stack } from "expo-router";
import { useAdminOrdersList } from "@/api/orders";

export default function OrdersScreen() {
  const {
    data: orders,
    error,
    isLoading,
  } = useAdminOrdersList({ archived: true });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
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
