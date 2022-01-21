import { Fragment, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useStore } from '../store/user-context';
import Carousel from './carouselSlides';
import { addCartRequest } from '../api/requests';
import { iAddCart } from './Icons';
import { ListProduct, ActionTypes } from './types';

const Listing = ({ products }: { products: ListProduct[] }) => {
  const router = useRouter();

  const getSlides = (v: ListProduct) => {
    return v.img.map((image) => {
      return (
        <div style={{ width: '100%' }}>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

const Card = ({
  pImg,
  product,
}: {
  pImg: JSX.Element[];
  product: ListProduct;
}) => {
  const [, dispatch] = useStore();

  const handleCart = async (e: MouseEvent, productId: number) => {
    e.preventDefault();
    const response = await addCartRequest({ productId, amount: 1 });
    if ('error' in response) return;
    dispatch({ type: ActionTypes.updateCart, cart: response });
  };

  return (
    <div className="relative flex flex-col bg-gray-200 m-auto p-4 gap-2 w-100 overflow-hidden">
      <div>
        <Carousel data={pImg} />
      </div>
      <span className="hover:underline">
        <Link href={`/shop/${product.id}`}>{product.title}</Link>
      </span>
      <div className="flex justify-between">
        <div className="self-center font-semibold text-green-800">
          C ${product.price}
        </div>
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

export default Listing;
