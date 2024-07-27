import React, { useEffect, useRef, useState } from "react";
import { Text, View, Animated, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const Toast = ({
  visible,
  message,
  duration = 3000,
}: {
  visible: boolean;
  message: string;
  duration?: number;
}) => {
  const [show, setShow] = useState(visible);
  const opacity = useState(new Animated.Value(0))[0];
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setShow(false));
        }, duration);
      });
    } else {
      setShow(false);
    }

    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [visible, duration, opacity]);

  if (!show) {
    return null;
  }

  return (
    <Animated.View style={[styles.toastContainer, { opacity }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 50,
    left: width * 0.1,
    right: width * 0.1,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  toastText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Toast;
