import 'tailwindcss/tailwind.css';
import '../style/styles.css';

import NavBar from '../components/navbar';
import { useStore, StoreProvider } from '../store/user-context';

import { AppProps } from 'next/app';

const AppComponent = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="">
      <StoreProvider>
        <div className="">
          <NavBar />
        </div>
        <div className="">
          <Component {...pageProps} />
        </div>
      </StoreProvider>
    </div>
  );
};

export default AppComponent;
