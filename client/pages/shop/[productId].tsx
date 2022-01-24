import {
  iStar,
  iAccount,
  iStarOut,
  iHalfStar,
  iFavOut,
  iFavourite,
} from '../../components/Icons';
import Image from 'next/image';
import { Fragment, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { GetStaticPaths, InferGetStaticPropsType } from 'next';
import {
  addCartRequest,
  delWishlistRequest,
  productsRequest,
  reviewRequest,
  showProductRequest,
  wishlistRequest,
} from '../../api/requests';
import Carousel from '../../components/carouselSlides';
import { ReviewCard } from '../../components/reviewCard';
import { useStore } from '../../store/user-context';
import { ActionTypes, Review } from '../../components/types';
import ErrorDisplay from '../../components/errorDisplay';

type Product = InferGetStaticPropsType<typeof getStaticProps>;

const ProductShow = ({ product }: Product) => {
  const imgSlides = product.img.map((img, i) => {
    return (
      <div key={i} className="w-full">
        <img src={`/${img}`} height="full" width="full" />
      </div>
    );
  });

  return (
    <div className=" pt-24 px-4 sm:px-12 flex flex-col space-x-2">
      <div className=" flex flex-col md:flex-row sm:w-3/4 overflow-hidden min-h-screen">
        <div className="max-w-sm sm:min-w-1/2">
          <div className="flex self-center sm:self-auto p-2 ">
            <Carousel data={imgSlides} />
          </div>
        </div>

        <p className="py-4 px-2 max-w-lg">{product.description}</p>
      </div>
      <ProductCard product={product} />

      <div className=" ">
        <ReviewSection reviewData={product.Review} productId={product.id} />
      </div>
    </div>
  );
};

const ProductCard = ({ product }: Product) => {
  const [globalState, dispatch] = useStore();
  const [wishlist, setWish] = useState(product.WishList);
  const [error, setError] = useState<string>(null);

  const addToCart = async () => {
    const response = await addCartRequest({ productId: product.id, amount: 1 });
    if ('error' in response) {
      setError(response.error);
      return;
    }
    dispatch({ type: ActionTypes.updateCart, cart: response });
  };

  const addToWishList = async () => {
    const wishList = globalState.data.wishlist.filter(
      (w) => w.productId === product.id
    )[0];
    if (wishList) {
      const response = await delWishlistRequest({ wishListId: wishList.id });
      if ('error' in response) {
        setError(response.error);
        return;
      }
      setWish(wishlist - 1);
      dispatch({ type: ActionTypes.delWish, wish: response });
    } else {
      const response = await wishlistRequest({ productId: product.id });
      if ('error' in response) {
        setError(response.error);
        return;
      }
      setWish(wishlist + 1);
      dispatch({ type: ActionTypes.wishlist, wish: response });
    }
  };
  return (
    <div className="sm:absolute right-5  sm:w-1/4 h-3/4">
      <div className="sticky top-24 flex flex-col gap-1 py-4">
        <div className="text-xl">{product.title}</div>
        <hr />
        <div className="text-right">${product.price}</div>
        <div>STOCK: {product.stock}</div>
        <button
          className="rounded-md bg-green-500 text-white px-4 py-2"
          onClick={(e) => {
            e.preventDefault();
            addToCart();
          }}
        >
          Add to Cart
        </button>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault;
              addToWishList();
            }}
          >
            {globalState.data.wishlist.filter(
              (w) => w.productId === product.id
            )[0]
              ? iFavourite
              : iFavOut}
          </button>
          {wishlist}
        </div>
      </div>
      {error && <ErrorDisplay message={error} close={() => setError(null)} />}
    </div>
  );
};

const ReviewSection = ({
  reviewData,
  productId,
}: {
  reviewData: Product['product']['Review'];
  productId: number;
}) => {
  const [globalState] = useStore();
  const [isOpen, setRev] = useState(false);
  const [review, setReview] = useState<typeof reviewData>(reviewData);
  const avgRating =
    review.reduce((p, c) => p + c.rating, 0) / review.length || 0;
  const sortRating: { [x: number]: number } = {};
  review.forEach((r) => {
    sortRating[r.rating] = sortRating[r.rating] + 1 || 1;
  });
  console.log('rating: ', avgRating);
  return (
    <>
      <div className="flex flex-col w-full mt-12">
        <div>Customer Reviews</div>
        <div className="flex">
          <div className="flex flex-col justify-center p-2 ">
            <div className="bg-blue-800 text-white text-2xl text-center p-2 rounded">
              {avgRating > 0 ? avgRating.toFixed(1) : '-'}/5
            </div>
            <div className="flex">
              {Array(5)
                .fill(iStar, 0, avgRating)
                .fill(iStarOut, avgRating, 5)
                .map((e, i) => (
                  <i key={i}>{e}</i>
                ))}
            </div>
            <div>{review.length} reviews</div>
          </div>
          <div className="flex flex-col p-2">
            <ReviewRatings ratings={sortRating} />
          </div>
        </div>
        <button
          onClick={(e) => {
            setRev(!isOpen);
          }}
          className="bg-blue-800 rounded-lg text-white p-2 max-w-sm"
        >
          Write a Review
        </button>
      </div>
      {isOpen && (
        <ReviewForm
          productId={productId}
          sendReview={(v: Review) => {
            setReview([
              ...review,
              { ...v, User: { username: globalState.username } },
            ]);
          }}
        />
      )}
      <ol className="my-12">
        {review.map((d, i) => (
          <li key={i}>{<ReviewCard data={d} />}</li>
        ))}
      </ol>
    </>
  );
};

const ReviewRatings = ({ ratings }: { ratings: { [x: number]: number } }) => {
  const ratingRef = useRef<HTMLDivElement>(null);
  const weightedRating =
    Object.keys(ratings).reduce((p, c) => p + ratings[parseInt(c)], 0) || 0;
  const calcWeight = (value: number, weight: number): number => {
    const percentVal = Math.round((value / weight) * 100) || 0;
    return percentVal;
  };

  return (
    <>
      {[5, 4, 3, 2, 1].map((r, i) => {
        return (
          <div key={i} className="flex items-center gap-2">
            <span>{r}</span>
            <div className="w-24 rounded-full h-2 bg-blue-200 ">
              <div
                style={{
                  width: `${calcWeight(ratings[r], weightedRating)}%`,
                }}
                className=" bg-blue-800 rounded-full h-full"
              ></div>
            </div>
            <span>{ratings[r] || 0}</span>
          </div>
        );
      })}
    </>
  );
};

const ReviewForm = ({
  productId,
  sendReview,
}: {
  productId: number;
  sendReview: (v: Review) => void;
}) => {
  const formRef = useRef<HTMLDivElement>(null);
  const [, dispatch] = useStore();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [rating, setRating] = useState<number>(1);
  const [error, setError] = useState<string>(null);

  useEffect(() => {
    formRef.current.style.transition = 'all 1s';
    formRef.current.style.height = '220px';
  }, []);

  const submitReview = async () => {
    const response = await reviewRequest({
      rating: rating > 0 ? rating : 1,
      title,
      description: desc,
      productId,
    });
    if ('error' in response) {
      setError(response.error);
      return;
    }
    dispatch({ type: ActionTypes.review, review: response });
    sendReview(response);
  };

  return (
    <div
      ref={formRef}
      className="flex flex-col bg-gray-200 gap-2 w-full p-2 my-4 overflow-y-hidden h-0"
    >
      <ReviewStars rating={(v: number) => setRating(v)} />
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submitReview();
        }}
      >
        <label>
          <input
            className="p-2 focus:outline-none focus:ring-1 focus:ring-blue-800 rounded-sm font-bold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title"
          />
        </label>
        <label>
          <textarea
            className="p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-800 rounded-sm "
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
          />
        </label>
        <input
          className="bg-red-500 p-2 rounded-lg text-white w-24"
          type="submit"
          value="Submit"
        />
      </form>
      {error && <ErrorDisplay message={error} close={() => setError(null)} />}
    </div>
  );
};

const ReviewStars = ({ rating }: { rating: (T: number) => void }) => {
  const [hover, setHover] = useState(0);
  const [clicked, setClicked] = useState(0);

  useEffect(() => {
    rating(clicked);
  }, [clicked]);

  return (
    <div
      className="flex cursor-pointer"
      onMouseLeave={() => {
        if (clicked === 0) {
          setHover(0);
        } else {
          setHover(clicked);
        }
      }}
    >
      {Array(5)
        .fill(iStar, 0, hover)
        .map((e, i) => {
          return (
            <div
              onMouseOver={(e) => setHover(i + 1)}
              key={i}
              onClick={(e) => setClicked(hover)}
            >
              {e}
            </div>
          );
        })}
      {Array(5)
        .fill(iStarOut, hover, 5)
        .map((e, i) => {
          return (
            <div
              onMouseOver={(e) => setHover(i + 1)}
              key={i}
              onClick={(e) => setClicked(hover)}
            >
              {e}
            </div>
          );
        })}
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await productsRequest();

  return {
    paths: products.map((p) => {
      return { params: { productId: p.id.toString() } };
    }),
    fallback: false,
  };
};

export async function getStaticProps({ params }) {
  const product = await showProductRequest({ id: params.productId });
  return { props: { product } };
}

export default ProductShow;
