import women_s from '../public/women_s.jpg';
import men_s from '../public/men_s.jpg';
import { useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const vidRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative">
      <div className="flex flex-col h-screen">
        <div className="max-w-full">
          <video
            className="absolute object-cover h-screen w-screen"
            autoPlay={true}
            src="/home-teaser.mp4"
            ref={vidRef}
            muted={true}
            loop={true}
          ></video>
        </div>
        <section className="flex flex-col items-center z-10 mt-48 mx-auto p-4">
          <article className="text-white text-center font-bold text-5xl font-main my-12 animate-text-in">
            Explore new Heights
          </article>
          <button
            onClick={(e) =>
              document
                .querySelector('#items')
                .scrollIntoView({ behavior: 'smooth' })
            }
            className="scroll-smooth border-white border-2 rounded-sm hover:bg-white hover:text-black text-white font-bold text-xl px-6 py-4  w-48 "
          >
            Discover
          </button>
        </section>
      </div>

      <div className="px-4 py-20 sm:p-20  my-auto" id="items">
        <h3 className="text-xl font-semibold mb-2">Shop Our Product Line: </h3>
        <section className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <Card
            title="Women's Wear"
            link="category?category=women"
            img={women_s.src}
          />
          <Card
            title="Men's Wear"
            link="category?category=men"
            img={men_s.src}
          />
        </section>
      </div>
    </div>
  );
};

const Card = ({
  title,
  link,
  img,
}: {
  title: string;
  link: string;
  img: string;
}) => {
  const router = useRouter();
  return (
    <div
      style={{ backgroundImage: `url(${img})`, minHeight: '600px' }}
      className="bg-center xl:bg-bottom bg-cover bg-no-repeat p-12 "
    >
      <div className="flex flex-col place-content-end gap-2 h-full">
        <h3 className="font-bold text-xl text-white">{title}</h3>
        <button
          className="font-bold bg-white rounded-full p-4 w-48 bg-gradient-to-r hover:from-green-400 hover:to-blue-500 hover:text-white"
          onClick={() => router.push(`/${link}`)}
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default Home;
