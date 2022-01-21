import 'tailwindcss/tailwind.css';
import '../style/styles.css';

import NavBar from '../components/navbar';
import { useStore, StoreProvider } from '../store/user-context';

import { AppProps } from 'next/app';

const AppComponent = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="font-body">
      <StoreProvider>
        <div className="">
          <NavBar />
        </div>
        <div className="">
          <Component {...pageProps} />
        </div>
      </StoreProvider>

      <div className=" relative mt-16">
        <footer className="absolute bottom-0 right-0 py-6 px-12">
          <span className="font-thin text-sm">2022</span>
        </footer>
      </div>
    </div>
  );
};

export default AppComponent;
