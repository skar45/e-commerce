import { Fragment, useCallback, useState, MouseEvent } from 'react';
import Carousel from '../../components/carouselSlides';
import SelectMenu from '../../components/selectionMenu';
import { addCartRequest, productsRequest } from '../../api/requests';
import { InferGetStaticPropsType } from 'next';
import { iAddCart } from '../../components/Icons';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useStore } from '../../store/user-context';
import { ActionTypes } from '../../components/types';

type Product = InferGetStaticPropsType<typeof getStaticProps>['products'][0];

const Shop = ({ products }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [inventory, setInventory] = useState<typeof products>(products);
  const memoPriceDown = useCallback(
    () => products.sort((a, b) => a.price - b.price),
    products
  );
  const memoPriceUp = useCallback(
    () => products.sort((a, b) => b.price - a.price),
    products
  );

  return (
    <div className="pt-24 px-8">
      <div className="flex justify-between pb-2">
        <button>Link</button>
        <div>
          <SelectMenu
            title="Sort"
            options={[
              { name: 'Featured', action: () => {} },
              {
                name: 'Price Up',
                action: () => {
                  setInventory([...memoPriceUp()]);
                },
              },
              {
                name: 'Price Down',
                action: () => {
                  setInventory([...memoPriceDown()]);
                },
              },
            ]}
          ></SelectMenu>
        </div>
      </div>
      <Listing products={inventory}></Listing>
    </div>
  );
};

const Listing = ({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  const getSlides = (v: Product) => {
    return v.img.map((image) => {
      return (
        <div style={{ width: '300px' }}>
          <img
            className="cursor-pointer"
            src={`/${image}`}
            width="100%"
            height="100%"
            loading="eager"
            onClick={() => {
              router.push(`shop/${v.id}`);
            }}
          ></img>
        </div>
      );
    });
  };
  return (
    <div className="flex flex-wrap">
      {products.map((e, idx) => {
        return (
          <Fragment key={idx}>
            <Card pImg={getSlides(e)} product={e} />
          </Fragment>
        );
      })}
    </div>
  );
};

const Card = ({ pImg, product }: { pImg: JSX.Element[]; product: Product }) => {
  const [, dispatch] = useStore();

  const handleCart = async (e: MouseEvent, productId: number) => {
    e.preventDefault();
    console.log('productId: ', productId);
    const response = await addCartRequest({ productId, amount: 1 });
    if ('error' in response) return;
    dispatch({ type: ActionTypes.updateCart, cart: response });
  };

  return (
    <div
      className="relative flex flex-col bg-gray-200 m-auto p-4 gap-2 overflow-hidden"
      style={{ width: '332px' }}
    >
      <div>
        <Carousel data={pImg} width={'300px'} />
      </div>
      <Link href={`/shop/${product.id}`}>{product.title}</Link>
      <div className="flex justify-between">
        <div className="self-center">${product.price}</div>
        <button
          className="bg-green-500 rounded-lg px-3 py-2"
          onClick={(e) => handleCart(e, product.id)}
        >
          {iAddCart}
        </button>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const products = await productsRequest();

  return { props: { products } };
}

export default Shop;
