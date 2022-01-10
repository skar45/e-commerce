import {
  User,
  Product,
  Review,
  Purchased,
  WishList,
  Cart,
  CartCookie,
  StoreType,
} from '../components/types';

type Err = {
  error: string;
};

type CurrentUserresponse =
  | (User & { ListItem: Cart[] } & { Review: Review[] } & {
      Purchased: Purchased[];
    } & { WishList: WishList[] })
  | { ListItem: CartCookie };

type ListProduct = Omit<Product, 'description'>;
type ParsedCart = StoreType['data']['items'][number];

export const signinRequest = async (data: {
  username: string;
  password: string;
}) => {
  const response = await fetch('http://localhost:3001/api/user/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  }).then((r) => r.json());

  if (response.error) {
    return response as Err;
  } else {
    return response as User & { ListItem: Cart[] };
  }
};

export const signupRequest = async (data: {
  username: string;
  password: string;
  email: string;
}) => {
  const response = await fetch('http://localhost:3001/api/user/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  }).then((r) => r.json());

  if (response.error) {
    return response as Err;
  } else {
    return response as User & { ListItem: Cart[] };
  }
};

export const signoutRequest = async () => {
  const response = await fetch('http://localhost:3001/api/user/signout', {
    method: 'GET',
    credentials: 'include',
  }).then((r) => r.json());

  return response || null;
};

export const getUserRequest = async () => {
  const response = await fetch('http://localhost:3001/api/user/currentuser', {
    method: 'GET',
    credentials: 'include',
  }).then((r) => r.json());

  if (response) {
    return response as CurrentUserresponse;
  } else {
    return null;
  }
};

const parseCartCookie = (cart: CartCookie): ParsedCart => {
  const productId = parseInt(Object.keys(cart)[0]);
  return {
    productId,
    amount: cart[productId].amount,
    Product: {
      price: cart[productId].price,
      title: cart[productId].title,
      img: cart[productId].img,
    },
  };
};

export const addCartRequest = async (data: {
  productId: number;
  amount: number;
}) => {
  const response = await fetch('http://localhost:3001/api/items/add', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  }).then((r) => r.json());
  // takes productId, amount
  // returns a single cart

  if ('error' in response) {
    return response as Err;
  } else {
    if ('id' in response) {
      return response as Cart;
    } else {
      return parseCartCookie(response);
    }
  }
};

export const deleteCartRequest = async (
  data: { productId: number } | { cartId: number }
) => {
  const response = await fetch('http://localhost:3001/api/items/remove', {
    method: 'DELETE',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  }).then((r) => r.json());
  // takes productId
  // returns batchload count

  return response as { count: number };
};

export const updateCartRequest = async (data: {
  productId: number;
  amount: number;
}) => {
  const response = await fetch('http://localhost:3001/api/items/modify', {
    method: 'PUT',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  }).then((r) => r.json());
  // takes in productId
  // returns single updatedCart

  if ('error' in response) {
    return response as Err;
  } else {
    if ('id' in response) {
      return response as Cart;
    } else {
      return parseCartCookie(response) as CartCookie;
    }
  }
};

export const reviewRequest = async (data: {
  productId: number;
  rating: number;
  description: string;
  title: string;
}) => {
  const response = await fetch('http://localhost:3001/api/items/review', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  }).then((r) => r.json());
  // takes productId, rating, description, title
  // returns the single review

  if (response.error) {
    return response as Err;
  } else {
    return response as Review;
  }
};

export const delReviewRequest = async (data: { reviewId: number }) => {
  const response = await fetch('http://localhost:3001/api/items/review', {
    method: 'DELETE',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  }).then((r) => r.json());
  // takes reviewId
  // returns the deleted review

  if (response.error) {
    return response as Err;
  } else {
    return response as Review;
  }
};

export const wishlistRequest = async (data: { productId: number }) => {
  const response = await fetch('http://localhost:3001/api/items/wishlist', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  }).then((r) => r.json());
  // takes productId
  // returns the single wishlist instance

  if (response.error) {
    return response as Err;
  } else {
    return response as WishList;
  }
};

export const delWishlistRequest = async (data: { wishListId: number }) => {
  const response = await fetch('http://localhost:3001/api/items/wishlist', {
    method: 'DELETE',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  }).then((r) => r.json());
  // takes wishlistId
  // returns the deleted wishlist instance

  if (response.error) {
    return response as Err;
  } else {
    return response as WishList;
  }
};

export const productsRequest = async () => {
  const response = await fetch('http://localhost:3001/api/items/list', {
    method: 'GET',
  }).then((r) => r.json());
  // returns a list of products

  return response as ListProduct[];
};

export const showProductRequest = async ({ id }: { id: string }) => {
  const response = await fetch(`http://localhost:3001/api/items/id/${id}`).then(
    (r) => r.json()
  );

  return response as
    | (Product & {
        Review: (Review & {
          User: {
            username: string;
          };
        })[];
        WishList: number;
      })
    | null;
};

export const purchaseRequest = async (data: { cartItems: Cart[] }) => {
  const response = await fetch('http://localhost:3001/api/items/purchase', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  }).then((r) => r.json());
  // takes cartItems
  // returns list of purchased items

  if (response.error) {
    return response as Err;
  } else {
    return response as Purchased[];
  }
};

export const createPaymentRequest = async () => {
  const response = await fetch('http://localhost:3001/api/create-payment').then(
    (r) => r.json()
  );
  return response as { stripeSecret: string | null };
};
