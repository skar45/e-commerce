import { useEffect, useLayoutEffect, useRef, useState, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import Script from 'next/script';
import { StoreType } from './types';
import { iClose } from './Icons';

const publishableKey =
  'pk_test_51Ib8bCDRIyOVCuu12rUHfgEHFu01HqimctvwenEs6Dt7L2ksfuenj3xzbs3LwdzIG6z2qJXbLvh9Is0alD2WdiuE00hcYNV1n8';

const PaymentModal = ({
  clientSecret,
  cart,
  close,
}: {
  clientSecret: string;
  cart: StoreType['data']['items'];
  close: (e?: string) => void;
}) => {
  const [stripe, setStripe] = useState<Stripe>(null);
  const [el, setEl] = useState(document.createElement('div'));

  useEffect(() => {
    const load = async () => {
      const getStripe = await loadStripe(publishableKey);
      setStripe(getStripe);
    };
    load();
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  return stripe
    ? createPortal(
        <Card
          stripe={stripe}
          clientSecret={clientSecret}
          cart={cart}
          close={close}
        />,
        el
      )
    : null;
};

const Card = ({
  stripe,
  clientSecret,
  cart,
  close,
}: {
  close: (e?: string) => void;
  cart: StoreType['data']['items'];
  stripe: Stripe;
  clientSecret: string;
}) => {
  const payRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  let total = 0;
  const elements = stripe.elements({
    appearance: { theme: 'stripe' },
    clientSecret,
  });
  const payElement = elements.create('payment', {
    business: { name: 'ACME' },
    wallets: { applePay: 'never', googlePay: 'never' },
    fields: {
      billingDetails: { name: 'auto', address: 'auto', email: 'auto' },
    },
    terms: {
      card: 'always',
      bancontact: 'always',
    },
  });

  useLayoutEffect(() => {
    payElement.mount(payRef.current);
  }, []);

  useEffect(() => {
    const setStyle = mainRef.current.style;
    setStyle.transition = '2s';
    setStyle.width = '100%';
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    if (response.error) {
      close(response.error.message);
    } else {
      close();
    }
  };

  return (
    <div className="absolute top-0 left-0 overflow-x-hidden">
      <div className="fixed flex z-50 h-screen w-full">
        <div
          className="flex flex-col h-screen w-0 p-6 bg-white z-10 max-w-md"
          ref={mainRef}
        >
          <div className="self-end">
            <button
              className="bg-white hover:bg-gray-200 border rounded-full mb-2 p-2"
              onClick={() => close()}
            >
              {iClose}
            </button>
          </div>

          <div className="flex flex-col">
            {cart.map((p) => {
              total += p.Product.price * p.amount;
              return (
                <div className="flex justify-between" key={p.productId}>
                  <span>
                    {p.amount > 1
                      ? p.amount + ' ' + p.Product.title
                      : p.Product.title}
                  </span>
                  <span>${p.Product.price * p.amount}</span>
                </div>
              );
            })}
          </div>
          <hr />
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${(total * 0.13).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total</span>
            <span>${(total + total * 0.13).toFixed(2)}</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div ref={payRef} className="my-6" />
            <input
              type="submit"
              value="Pay Now"
              className="cursor-pointer px-3 py-2 text-white bg-blue-500 rounded-md font-bold w-full overflow-hidden"
            />
          </form>
        </div>
        <style jsx>
          {`
            :global(body) {
              overflow: hidden;
            }
          `}
        </style>
        <div
          className="fixed bg-black opacity-50 w-screen h-screen cursor-pointer"
          onClick={() => close()}
        ></div>
      </div>
    </div>
  );
};

export default PaymentModal;
