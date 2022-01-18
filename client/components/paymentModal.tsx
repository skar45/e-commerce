import { useEffect, useLayoutEffect, useRef, useState, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import Script from 'next/script';

const publishableKey =
  'pk_test_51Ib8bCDRIyOVCuu12rUHfgEHFu01HqimctvwenEs6Dt7L2ksfuenj3xzbs3LwdzIG6z2qJXbLvh9Is0alD2WdiuE00hcYNV1n8';

const PaymentModal = ({ clientSecret }: { clientSecret: string }) => {
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
    ? createPortal(<Card stripe={stripe} clientSecret={clientSecret} />, el)
    : null;
};

const Card = ({
  stripe,
  clientSecret,
}: {
  stripe: Stripe;
  clientSecret: string;
}) => {
  const payRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const elements = stripe.elements({
    appearance: { theme: 'stripe' },
    clientSecret,
  });
  const payElement = elements.create('payment', {
    business: { name: 'deeznuts' },
    wallets: { applePay: 'never', googlePay: 'never' },
    fields: { billingDetails: 'auto' },
  });

  useLayoutEffect(() => {
    payElement.mount(payRef.current);
  }, []);

  useEffect(() => {
    const setStyle = mainRef.current.style;
    setStyle.transition = '2s';
    setStyle.width = '33%';
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    console.log('payment response', response);
  };

  return (
    <div className="absolute top-0 left-0">
      <div
        className="fixed z-50 h-screen w-0 p-6 bg-white overflow-x-hidden"
        ref={mainRef}
      >
        <form onSubmit={handleSubmit}>
          <div ref={payRef} className="my-6" />
          <input
            type="submit"
            value="Pay Now"
            className="cursor-pointer px-3 py-2 w-full text-white bg-blue-500 rounded-md font-bold"
          />
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
