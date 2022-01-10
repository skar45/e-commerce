import { Fragment } from 'react';
import Image from 'next/image';
import Carousel from '../../components/carouselSlides';
import SelectMenu from '../../components/selectionMenu';
import { JsxElement } from 'typescript';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { productsRequest } from '../../api/requests';
import router from 'next/router';

const Search = ({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { params, category } = router.query;
  let items: typeof products;
  if (category && category !== '') {
    if (typeof category === 'string') {
      items = products.filter((p) => p.category.includes(category));
    } else {
      items = products.filter((p) => p.category.includes(category.join('')));
    }
  } else if (typeof params === 'string') {
    const tags = products.filter((p) => p.tags.includes(params));
    const category = products.filter((p) => p.category.includes(params));
    const title = products.filter((p) => p.title.includes(params));
    const description = products.filter((p) => p.description.includes(params));
    items = tags.concat(category).concat(title).concat(description);
  }

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
    <div className="pt-24 px-16">
      <div className="flex justify-between pb-2">
        <div>Link</div>
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

  return { props: { products } };
}

export default Search;
