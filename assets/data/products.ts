import { PizzaSize, Product } from "@/types";

export const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

const products: Product[] = [
  {
    id: 1,
    name: "Ultimate Pepperoni",
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/peperoni.png",
    prices: {
      S: 10.99,
      M: 12.99,
      L: 14.99,
      XL: 16.99,
    },
  },
  {
    id: 2,
    name: "ExtravaganZZa",
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/extravaganzza.png",
    prices: {
      S: 12.49,
      M: 14.99,
      L: 17.49,
      XL: 19.99,
    },
  },
  {
    id: 3,
    name: "MeatZZa",
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/peperoni.png",
    prices: {
      S: 11.47,
      M: 13.47,
      L: 15.47,
      XL: 17.47,
    },
  },
  {
    id: 4,
    name: "Margarita",
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/margarita.png",
    prices: {
      S: 8.49,
      M: 9.9,
      L: 11.49,
      XL: 12.99,
    },
  },
  {
    id: 5,
    name: "Pacific Veggie",
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/veggie.png",
    prices: {
      S: 10.49,
      M: 12.99,
      L: 14.99,
      XL: 16.99,
    },
  },
  {
    id: 6,
    name: "Hawaiian",
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/hawaiin.png",
    prices: {
      S: 8.99,
      M: 10.49,
      L: 12.49,
      XL: 14.49,
    },
  },
  {
    id: 7,
    name: "Deluxe",
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/deluxe.png",
    prices: {
      S: 14.99,
      M: 16.99,
      L: 18.99,
      XL: 20.99,
    },
  },
  {
    id: 8,
    name: "BBQ Chicken",
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/veggie.png",
    prices: {
      S: 10.89,
      M: 12.89,
      L: 14.89,
      XL: 16.89,
    },
  },
  {
    id: 9,
    name: "Chicken Bacon Ranch",
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/extravaganzza.png",
    prices: {
      S: 11.99,
      M: 13.99,
      L: 15.99,
      XL: 17.99,
    },
  },
  {
    id: 10,
    name: "6 Cheese",
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/6cheese.png",
    prices: {
      S: 10.29,
      M: 13.29,
      L: 15.29,
      XL: 17.29,
    },
  },
  {
    id: 11,
    name: "6 Cheese",
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/6cheese.png",
    prices: {
      S: 10.29,
      M: 13.29,
      L: 15.29,
      XL: 17.29,
    },
  },
];

export default products;

export const defaultImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";
