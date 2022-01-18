import {
  createContext,
  useReducer,
  Dispatch,
  useContext,
  Reducer,
  useEffect,
  ReactNode,
} from 'react';
import { getUserRequest } from '../api/requests';
import type { StoreType } from '../components/types';
import { ActionTypes } from '../components/types';

interface Action {
  type: ActionTypes;
  data?: StoreType;
  cart?: StoreType['data']['items'][number];
  review?: StoreType['data']['reviews'][number];
  wish?: StoreType['data']['wishlist'][number];
}

const defaultState: StoreType = {
  id: null,
  username: null,
  email: null,
  cartItems: 0,
  data: { reviews: [], items: [], wishlist: [], purchase: [] },
};

const Store = createContext<[StoreType, Dispatch<Action>]>([null, null]);

const useStore = () => useContext(Store);

const reducer = (state: StoreType, action: Action) => {
  switch (action.type) {
    case ActionTypes.fetch:
      if (action.data) {
        state = action.data;
        return { ...state };
      } else {
        return state;
      }
    case ActionTypes.updateCart:
      let productFound: boolean = false;
      state.data.items.forEach((p) => {
        if (p.productId === action.cart.productId) {
          p.amount += action.cart.amount;
          productFound = true;
        }
      });
      if (!productFound) {
        state.cartItems++;
        state.data.items.push(action.cart);
      }

      return { ...state };
    case ActionTypes.modCart:
      state.data.items.forEach((v) => {
        if (v.productId === action.cart.productId) {
          v.amount = action.cart.amount;
        }
      });
      return { ...state };
    case ActionTypes.delCart:
      state.data.items = state.data.items.filter(
        (v) => v.productId !== action.cart.productId
      );
      state.cartItems--;
      return { ...state };
    case ActionTypes.review:
      state.data.reviews.push(action.review);
      return { ...state };
    case ActionTypes.delReview:
      state.data.reviews = state.data.reviews.filter(
        (v) => v.id !== action.review.id
      );
      return { ...state };
    case ActionTypes.wishlist:
      state.data.wishlist.push(action.wish);
      return { ...state };
    case ActionTypes.delWish:
      state.data.wishlist = state.data.wishlist.filter(
        (v) => v.id !== action.wish.id
      );
      return { ...state };
    case ActionTypes.clear:
      state = defaultState;
      return { ...state };
  }
};

const userData = async () => {
  const res = await getUserRequest();

  if (!res) return;
  if ('username' in res) {
    const data = {
      username: res.username,
      id: res.id,
      email: res.email,
      cartItems: res.ListItem.length,
      data: {
        wishlist: res.WishList,
        reviews: res.Review,
        items: res.ListItem,
        purchase: res.Purchased,
      },
    };
    return data;
  }

  return res;
};

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [globalState, dispatch] = useReducer<Reducer<StoreType, Action>>(
    reducer,
    defaultState
  );

  useEffect(() => {
    const load = async () => {
      const user = await userData();
      if (!user) return;
      if ('id' in user) {
        dispatch({ type: ActionTypes.fetch, data: user });
      } else if ('ListItem' in user) {
        Object.keys(user.ListItem).forEach((k) => {
          const id = parseInt(k);
          const product = user.ListItem[id];
          dispatch({
            type: ActionTypes.updateCart,
            cart: {
              productId: id,
              amount: product.amount,
              Product: {
                price: product.price,
                title: product.title,
                img: product.img,
              },
            },
          });
        });
      }
    };
    load();
  }, []);

  return (
    <Store.Provider value={[globalState, dispatch]}>{children}</Store.Provider>
  );
};

export { useStore, StoreProvider };
