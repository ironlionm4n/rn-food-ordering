import { useInsertOrderItems } from "@/api/order-items";
import { useInsertOrder } from "@/api/orders";
import { CartItem, Tables } from "@/types";
import { router, useRouter } from "expo-router";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type CartType = {
  items: CartItem[];
  onAddItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: -1 | 1) => void;
  total: number;
  checkout: () => void;
};

const CartContext = createContext<CartType>({
  items: [],
  onAddItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
});

export default function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

  const router = useRouter();

  const onAddItem = (item: CartItem) => {
    const foundProductInCart = items.find(
      (i) => i.product.id === item.product.id && i.size === item.size
    );
    if (foundProductInCart) {
      onUpdateQuantity(foundProductInCart.id, 1);
      return;
    }

    setItems([...items, item]);
  };

  useEffect(() => {
    console.log("Cart items", items);
  }, [items]);

  const onUpdateQuantity = (id: string, quantity: -1 | 1) => {
    const newItems = items
      .map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + quantity };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setItems(newItems);
  };

  const total = items.reduce((accu, item) => {
    return accu + item.price * item.quantity;
  }, 0);

  const clearCart = () => {
    setItems([]);
  };

  const checkout = () => {
    insertOrder(
      { total },
      {
        onSuccess: saveOrderItems,
      }
    );
  };

  const saveOrderItems = (data: Tables<"orders">) => {
    const orderItems = items.map((item) => ({
      order_id: data.id,
      product_id: item.product.id,
      quantity: item.quantity,
      size: item.size,
    }));

    console.log("Save order item", orderItems);
    insertOrderItems(orderItems, {
      onSuccess: (d) => {
        console.log("Order created", d);
        clearCart();
        router.push(`/(user)/orders/${d[0].order_id}`);
      },
      onError: (e) => {
        console.error("Error creating order item", e);
      },
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        onAddItem,
        updateQuantity: onUpdateQuantity,
        total,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
