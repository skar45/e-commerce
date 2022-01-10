import { iFavourite, iHalfStar, iStar } from '../components/Icons';

import Image from 'next/image';
import { Fragment, useEffect, useRef, useState } from 'react';
import { StoreProvider, useStore } from '../store/user-context';
import { ActionTypes, StoreType } from '../components/types';
import { ReviewCard } from '../components/reviewCard';
import SelectMenu from '../components/selectionMenu';
import {
  addCartRequest,
  deleteCartRequest,
  delWishlistRequest,
  updateCartRequest,
} from '../api/requests';

enum activeTab {
  Cart = 'cart',
  Wish = 'wish',
  Review = 'review',
}
interface animateTab {
  initialX1?: number;
  initialX2?: number;
  x1: number;
  x2: number;
  width: number;
}

const Cart = () => {
  const tabRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<activeTab>(activeTab.Cart);
  const [lineW, setLine] = useState<animateTab>({ width: 0, x1: 0, x2: 0 });
  const [store, dispatch] = useStore();

  useEffect(() => {
    const w = tabRef.current.children[0].clientWidth;
    setLine({ width: w, x1: 0, x2: w });
  }, []);

  const switchTab = () => {
    switch (tab) {
      case activeTab.Cart:
        return <ShoppingCart items={store.data.items} />;
      case activeTab.Review:
        return <Reviews items={store.data.reviews} user={store.username} />;
      case activeTab.Wish:
        return <WishList items={store.data.wishlist} />;
    }
  };

  const triggerAnimation = (tabNum: number) => {
    let x1 = 0;
    let x2 = 0;
    for (let i = 0; i < tabNum; i++) {
      if (i < tabNum - 1) {
        x1 += tabRef.current.children[i].clientWidth;
      }
      x2 += tabRef.current.children[i].clientWidth;
    }
    let width = x2 - x1;
    const initialX1 = lineW.x1;
    const initialX2 = lineW.x2;
    const dim = { initialX1, initialX2, x1, x2, width };
    setLine({ ...dim });
  };
  console.log('render');
  return (
    <div className="pt-24 px-16">
      <div className="border-b-2 p-2">
        <div className="flex" ref={tabRef}>
          <button
            className={`p-2 ${tab === 'cart' && 'text-red-500'}`}
            onClick={() => {
              setTab(activeTab.Cart);
              triggerAnimation(1);
            }}
          >
            CART {store.data.items.length}
          </button>
          <button
            className={`p-2 ${tab === 'wish' && 'text-red-500'}`}
            onClick={() => {
              setTab(activeTab.Wish);
              triggerAnimation(2);
            }}
          >
            WISH LIST {store.data.wishlist.length}
          </button>
          <button
            className={`p-2 ${tab === 'review' && 'text-red-500'}`}
            onClick={() => {
              setTab(activeTab.Review);
              triggerAnimation(3);
            }}
          >
            REVIEW {store.data.reviews.length}
          </button>
        </div>

        {tab === 'review' && <Underline dim={lineW} />}
        {tab === 'cart' && <Underline dim={lineW} />}
        {tab === 'wish' && <Underline dim={lineW} />}
      </div>
      <div className="flex bg-gray-200 p-2">
        {switchTab()}
        <div className="flex flex-col bg-white p-4 border w-1/3">
          <div className="font-bold font text-xl border-b-2 p-2">
            Order Summary
          </div>
          {store.data.items.map((p, i) => {
            return (
              <div className="flex justify-between" key={p.productId}>
                <span>
                  {p.amount > 0
                    ? p.amount + ' ' + p.Product.title
                    : p.Product.title}
                </span>
                <span>${p.Product.price}</span>
              </div>
            );
          })}
          <div className="p-2 border-t-2">
            <button className="bg-green-600 text-white w-full rounded p-2">
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShoppingCart = ({ items }: { items: StoreType['data']['items'] }) => {
  console.log(items);
  return (
    <ol className="flex flex-col border-b-2 p-3 w-full">
      {items.map((p, i) => {
        return (
          <Fragment key={i}>
            <CartCard item={p} />
          </Fragment>
        );
      })}
    </ol>
  );
};

const CartCard = ({ item }: { item: StoreType['data']['items'][number] }) => {
  console.log(item);
  const [, dispatch] = useStore();

  const deleteItem = async () => {
    const res = await deleteCartRequest(
      item.id ? { cartId: item.id } : { productId: item.productId }
    );
    if ('error' in res) return;
    dispatch({ type: ActionTypes.delCart, cart: item });
  };

  const editCart = async (amount: number) => {
    const res = await updateCartRequest({ productId: item.productId, amount });
    console.log(res);
    if ('error' in res) return console.log('edit error: ', res.error);
    dispatch({ type: ActionTypes.modCart, cart: res });
  };

  return (
    <li className="relative flex justify-between border-t-2 p-4">
      <div className="flex space-x-2">
        <div className="h-full">
          <Image src={`/${item.Product.img[0]}`} width="300" height="300" />
        </div>
        <div className="flex flex-col">
          <div className="font-bold">{item.Product.title}</div>
          <div className="flex justify-between">
            <span className="self-center">QTY: </span>
            <SelectMenu
              title={item.amount.toString()}
              options={Array.from(Array(10).keys()).map((i) => {
                return {
                  name: (i + 1).toString(),
                  action: () => {
                    editCart(i + 1);
                    console.log('action: ', i + 1);
                  },
                };
              })}
            />
          </div>
        </div>
      </div>
      <button
        className="absolute bottom-0 right-0 text-blue-500 underline"
        onClick={deleteItem}
      >
        Delete
      </button>
      <div className="">${item.Product.price}</div>
    </li>
  );
};

const WishList = ({ items }: { items: StoreType['data']['wishlist'] }) => {
  const [, dispatch] = useStore();

  const addToCart = async (productId: number) => {
    const response = await addCartRequest({ productId, amount: 1 });
    if ('error' in response) return;
    dispatch({ type: ActionTypes.updateCart, cart: response });
  };

  const delWishlist = async (wishListId: number) => {
    const response = await delWishlistRequest({ wishListId });
    if ('error' in response) return;
    dispatch({ type: ActionTypes.delWish, wish: response });
  };

  return (
    <ol className="flex flex-wrap gap-2 p-2 w-full">
      {items.map((w) => {
        return (
          <li className="flex flex-col p-2" key={w.id}>
            <img width={300} height={300} src={`/${w.Product.img[0]}`} />
            <div className="flex justify-between">
              <span>{w.Product.title}</span>
              <button
                onClick={() => {
                  delWishlist(w.id);
                }}
              >
                {iFavourite}
              </button>
            </div>
            <span>${w.Product.price}</span>
            <button
              className="text-white bg-green-500 px-2 py-1"
              onClick={() => {
                addToCart(w.productId);
              }}
            >
              Add to Cart
            </button>
          </li>
        );
      })}
    </ol>
  );
};

const Reviews = ({
  items,
  user,
}: {
  items: StoreType['data']['reviews'];
  user: string;
}) => {
  return (
    <ol className="flex flex-col p-3 w-full">
      {items.map((p, i) => {
        return (
          <li key={i}>
            <ReviewCard data={{ ...p, User: { username: user } }} />
          </li>
        );
      })}
    </ol>
  );
};

const Underline = ({ dim }: { dim: animateTab }) => {
  return (
    <>
      <svg height="3" width={300}>
        <line
          x1={dim.x1}
          x2={dim.x2}
          style={{ stroke: 'rgb(255,0,0)', strokeWidth: '5' }}
        >
          <animate
            attributeName="x2"
            from={dim.initialX2}
            to={dim.x2}
            dur="0.25"
          />

          <animate
            attributeName="x1"
            from={dim.initialX1}
            to={dim.x1}
            dur="0.25"
          />
        </line>
      </svg>
    </>
  );
};

export default Cart;
