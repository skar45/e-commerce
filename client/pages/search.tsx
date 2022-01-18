import { Fragment, useState, ChangeEvent, useMemo } from 'react';
import Image from 'next/image';
import Carousel from '../components/carouselSlides';
import SelectMenu from '../components/selectionMenu';
import { JsxElement } from 'typescript';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { productsRequest } from '../api/requests';

type Products = InferGetStaticPropsType<typeof getStaticProps>;

const Search = ({ products }: Products) => {
  const [query, setQuery] = useState('');

  const filterItems = (items: typeof products, terms: string[]) => {
    let results = items;

    terms.forEach((param) => {
      const title = results.filter((p) => {
        return (
          p.title.toLowerCase().split('').includes(param) ||
          p.tags.includes(param) ||
          p.category.includes(param)
        );
      });
      results = title;
    });

    return results;
  };

  const getResults = useMemo(
    () =>
      filterItems(
        products,
        typeof query === 'string' ? query.split(' ') : query
      ),
    [query]
  );

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="pt-24 flex place-items-center flex-col gap-2 px-16">
      <input
        value={query}
        onChange={handleInput}
        className="w-full md:w-3/4 p-2 rounded focus:outline-none ring-2 focus:ring-blue-600"
      />
      {getResults.length > 0 ? (
        <Layout items={getResults} query={query} />
      ) : (
        <div className="mt-32">0 results for "{query}"</div>
      )}
    </div>
  );
};

const Layout = ({
  items,
  query,
}: {
  items: Products['products'];
  query: string;
}) => {
  const slides = items.map((v) => {
    return v.img.map((image) => {
      return (
        <div>
          <img src={image} width="300" height="400"></img>
        </div>
      );
    });
  });

  return (
    <div>
      <div className="flex justify-between pb-2">
        <div>
          {items.length} results for "{query}"
        </div>
        <div>
          <SelectMenu
            title="sort"
            options={[
              { name: 'Featured', action: () => {} },
              { name: 'Price Up', action: () => {} },
              { name: 'Price Down', action: () => {} },
            ]}
          ></SelectMenu>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {slides.map((e, idx) => {
          return (
            <Fragment key={idx}>
              <Card data={e} />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

const Card = ({ data }: { data: JSX.Element[] }) => {
  return (
    <div className=" flex flex-col items-center bg-gray-200 m-auto w-full p-2 overflow-hidden">
      <Carousel data={data} width={'200px'} />
      <div>Title</div>
      <div>Things</div>
    </div>
  );
};

export async function getStaticProps() {
  const products = await productsRequest();
  console.log('static search request');
  return { props: { products } };
}

export default Search;
