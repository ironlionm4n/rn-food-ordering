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
import { convertIdStringToFloat, formatDecimalInput } from "@/utility/helpers";
import Colors from "@/constants/Colors";
import Toast from "@/components/Toast";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";
import { randomUUID } from "expo-crypto";
import { supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

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
    case "M":
    case "L":
    case "XL":
      return { ...state, [action.type]: action.payload };
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
  const { id: idString } = useLocalSearchParams();
  const id = convertIdStringToFloat(idString);

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

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct(id);
  const { data: productToUpdate } = useProduct(id);
  // console.log("Product to Update", productToUpdate);

  const router = useRouter();

  useEffect(() => {
    if (isUpdating && productToUpdate) {
      setName(productToUpdate.name || "");
      setPizzaImage(productToUpdate.image || defaultImage);

      const prices = productToUpdate.prices as Record<PizzaSize, number>;
      if (prices) {
        Object.keys(prices).forEach((size) => {
          const pizzaSize = size as PizzaSize;
          dispatch({
            type: size as PizzaSize,
            payload: prices[pizzaSize]?.toString() || "",
          });
        });
      }
    }
  }, [productToUpdate]);

  const onCreate = async () => {
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
    const imagePath = await uploadImage();
    console.log("Image Path", imagePath);
    insertProduct(
      {
        name: name,
        image: imagePath || defaultImage,
        prices: numericPrices,
      },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  const onSubmit = () => {
    if (isUpdating) {
      console.log("Updating Product");
      onUpdate();
    } else {
      onCreate();
    }
  };

  const onUpdate = async () => {
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

    const imagePath = await uploadImage();

    updateProduct(
      {
        id: id,
        name: name,
        image: imagePath || defaultImage,
        prices: numericPrices,
      },
      {
        onSuccess: (product) => {
          resetFields();
          router.back();
        },
      }
    );
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

  const uploadImage = async () => {
    if (!pizzaImage?.startsWith("file://")) {
      return;
    }

    console.log("pizzaImage", pizzaImage);

    const base64 = await FileSystem.readAsStringAsync(pizzaImage, {
      encoding: "base64",
    });

    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    console.log("uploadImage Data", data);

    if (error) {
      console.log("Error uploading image", error);
      return;
    }

    if (data) {
      return data.path;
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
    deleteProduct();
    router.replace("/(admin)/menu");
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
