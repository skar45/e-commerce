import { ReactElement } from 'react';

export interface menuItem {
  icon?: ReactElement;
  h: string;
  p: string;
  link?: string;
}

export interface navItems {
  name: string;
  item?: menuItem[];
  link?: string;
}

export type Product = {
  id: number;
  price: number;
  title: string;
  description: string;
  category: string[];
  tags: string[];
  stock: number;
  img: string[];
};

export type Cart = {
  id: number;
  productId: number;
  userId: number;
  amount: number;
  Product: {
    price: number;
    title: string;
    img: string[];
  };
};

export type WishList = {
  id: number;
  productId: number;
  userId: number;
  Product: {
    price: number;
    title: string;
    img: string[];
  };
};

export type User = {
  id: number;
  email: string;
  username: string;
};

export type Review = {
  id: number;
  productId: number;
  rating: number;
  title: string;
  description: string;
  userId: number;
  Product: {
    title: string;
  };
};

export type Purchased = {
  id: number;
  productId: number;
  userId: number;
  amount: number;
  date: Date;
};

export interface StoreType {
  id: number | null;
  username: string | null;
  email: string | null;
  cartItems: number;
  data?: {
    reviews: Review[];
    items: PartialFilter<Cart, 'id' | 'userId'>[];
    wishlist: WishList[];
    purchase: Purchased[];
  };
}

export type CartCookie = {
  [key: number]: {
    title: string;
    price: number;
    amount: number;
    img: string[];
  };
};

type PartialFilter<T, K extends keyof T> = { [P in K]?: T[K] } & {
  [P in Exclude<keyof T, K>]: T[P];
};

export enum ActionTypes {
  updateCart,
  fetch,
  clear,
  delCart,
  review,
  delReview,
  wishlist,
  delWish,
  modCart,
}
