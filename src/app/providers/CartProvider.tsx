import { CartItem } from "@/types";
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
};

const CartContext = createContext<CartType>({
  items: [],
  onAddItem: () => {},
  updateQuantity: () => {},
  total: 0,
});

export default function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);

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
    return accu + item.product.price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, onAddItem, updateQuantity: onUpdateQuantity, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
