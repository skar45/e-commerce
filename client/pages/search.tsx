import { Fragment, useState, ChangeEvent, useMemo } from 'react';
import Image from 'next/image';
import Carousel from '../components/carouselSlides';
import SelectMenu from '../components/selectionMenu';
import { JsxElement } from 'typescript';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { productsRequest } from '../api/requests';
import Listing from '../components/listing';

type Products = InferGetStaticPropsType<typeof getStaticProps>;

const Search = ({ products }: Products) => {
  const [query, setQuery] = useState('');

  const filterItems = (items: typeof products, terms: string[]) => {
    let results = items;

    terms.forEach((param) => {
      param.toLowerCase();
      param.trim();
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
        <Listing products={getResults} />
      ) : (
        <div className="mt-32">0 results for "{query}"</div>
      )}
    </div>
  );
};

export async function getStaticProps() {
  const products = await productsRequest();
  console.log('static search request');
  return { props: { products } };
}

export default Search;
