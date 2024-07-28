import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { Reducer, useEffect, useRef } from "react";
import products, { defaultImage, sizes } from "@assets/data/products";
import Button from "@/components/Button";
import { PizzaSize } from "@/types";
import { formatDecimalInput } from "@/utility/helpers";
import Colors from "@/constants/Colors";
import Toast from "@/components/Toast";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams } from "expo-router";

type SizePriceState = {
  S: string;
  M: string;
  L: string;
  XL: string;
};

type SizePriceAction = {
  type: "S" | "M" | "L" | "XL" | "reset";
  payload: string;
};

const sizePriceReducer: Reducer<SizePriceState, SizePriceAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "S":
      return { ...state, S: action.payload };
    case "M":
      return { ...state, M: action.payload };
    case "L":
      return { ...state, L: action.payload };
    case "XL":
      return { ...state, XL: action.payload };
    case "reset":
      return initialSizeState;
    default:
      return state;
  }
};

const initialSizeState: SizePriceState = {
  S: "",
  M: "",
  L: "",
  XL: "",
};

const CreateProductScreen = () => {
  const { id } = useLocalSearchParams();

  console.log("ID:", id);

  const isUpdating = !!id;

  const [name, setName] = React.useState("");
  const [errors, setErrors] = React.useState<string>("");
  const [showToast, setShowToast] = React.useState<boolean>(false);
  const [pizzaImage, setPizzaImage] = React.useState<string | null>(null);
  const toastRef = useRef<NodeJS.Timeout | null>(null);
  const [sizePrices, dispatch] = React.useReducer(
    sizePriceReducer,
    initialSizeState
  );
  const onCreate = () => {
    if (!validateForm()) {
      console.log("Form is invalid", errors);
      setShowToast(true);
      clearTimeout(toastRef.current as NodeJS.Timeout);
      toastRef.current = setTimeout(() => {
        setShowToast(false);
        setErrors("");
      }, 3000);
      return;
    }

    // Convert the prices to numbers when needed
    const numericPrices = {
      S: parseFloat(sizePrices.S) || 0,
      M: parseFloat(sizePrices.M) || 0,
      L: parseFloat(sizePrices.L) || 0,
      XL: parseFloat(sizePrices.XL) || 0,
    };
    console.log("Product Created:", { name, numericPrices });
    products.push({
      id: products.length + 1,
      name: name,
      image: pizzaImage || defaultImage,
      prices: numericPrices,
    });
  };

  const onSubmit = () => {
    if (isUpdating) {
      console.log("Updating Product");
    } else {
      onCreate();
    }
  };

  const onUpdate = () => {
    if (!validateForm()) {
      console.log("Form is invalid", errors);
      setShowToast(true);
      clearTimeout(toastRef.current as NodeJS.Timeout);
      toastRef.current = setTimeout(() => {
        setShowToast(false);
        setErrors("");
      }, 3000);
      return;
    }

    // Convert the prices to numbers when needed
    const numericPrices = {
      S: parseFloat(sizePrices.S) || 0,
      M: parseFloat(sizePrices.M) || 0,
      L: parseFloat(sizePrices.L) || 0,
      XL: parseFloat(sizePrices.XL) || 0,
    };

    const productIndex = products.findIndex((p) => p.id === Number(id));
    if (productIndex === -1) {
      console.log("Product not found");
      return;
    }

    products[productIndex] = {
      id: Number(id),
      name: name,
      image: pizzaImage || defaultImage,
      prices: numericPrices,
    };
  };

  const validateForm = () => {
    if (!name) {
      setErrors("Please enter a name for the product");
      return false;
    }

    const hasPrice = Object.values(sizePrices).every((price) => price !== "");
    if (!hasPrice) {
      setErrors("Please enter a price for each product");
      return false;
    }

    return true;
  };

  const handleNameChange = (e: string) => {
    console.log(e);
    setName(e);
  };

  const resetFields = () => {
    setName("");
    dispatch({ type: "reset", payload: "" });
    setErrors("");
    setShowToast(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setPizzaImage(result.assets[0].uri);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
        },
        { text: "Delete", onPress: handleDelete, style: "destructive" },
      ]
    );
  };

  const handleDelete = () => {
    const productIndex = products.findIndex((p) => p.id === Number(id));
    if (productIndex === -1) {
      console.log("Product not found");
      return;
    }

    products.splice(productIndex, 1);
  };

  useEffect(() => {
    return () => {
      if (toastRef.current) {
        clearTimeout(toastRef.current);
      }
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: isUpdating ? "Update Product" : "Create Product",
          }}
        />
        <Toast visible={showToast} message={errors} />
        <Image
          source={{ uri: pizzaImage || defaultImage }}
          style={styles.pizzaImage}
        />
        <TouchableOpacity
          style={{
            backgroundColor: Colors.light.tint,
            paddingVertical: 4,
            paddingHorizontal: 16,
            borderRadius: 5,
          }}
          onPress={pickImage}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Select an Image
          </Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.text}>Pizza Name</Text>
          <TextInput
            placeholder="Pizza Name"
            style={styles.textInput}
            onChangeText={handleNameChange}
            value={name}
          />
          <Text style={styles.text}>Sizes and Prices</Text>
          <View style={styles.sizeRowContainer}>
            {sizes.map((size, index) => {
              return (
                <View key={index} style={styles.sizeInputContainer}>
                  <Text style={{ fontSize: 16 }}>Size: {size}</Text>
                  <TextInput
                    keyboardType="decimal-pad"
                    style={styles.numericInput}
                    value={sizePrices[size as PizzaSize].toString()}
                    onChangeText={(text: string) =>
                      dispatch({
                        type: size as PizzaSize,
                        payload: formatDecimalInput(text),
                      })
                    }
                  />
                </View>
              );
            })}
          </View>
        </View>
        <Button text={isUpdating ? "Update" : "Create"} onPress={onSubmit} />
        {isUpdating && (
          <Button text="Delete" onPress={confirmDelete} type="delete" />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
    margin: 8,
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "lightgrey",
    padding: 8,
    borderRadius: 5,
    gap: 8,
  },
  sizeRowContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 8,
  },
  sizeInputContainer: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
    width: "45%",
  },
  text: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  textInput: {
    backgroundColor: "white",
    padding: 6,
    borderRadius: 5,
    color: "black",
    fontSize: 20,
  },
  numericInput: {
    width: "100%",
    padding: 5,
    borderRadius: 5,
    color: "white",
    fontSize: 16,
    backgroundColor: Colors.light.tint,
    fontWeight: "600",
    textAlign: "center",
  },
  pizzaImage: {
    width: "50%",
    aspectRatio: 1,
    backgroundColor: "lightgrey",
    borderRadius: 10,
  },
});
