import { useCallback, useState } from 'react';
import SelectMenu from '../../components/selectionMenu';
import { productsRequest } from '../../api/requests';
import { InferGetStaticPropsType } from 'next';
import { iFeatured, iTrendDown, iTrendUp } from '../../components/Icons';
import Listing from '../../components/listing';

const Shop = ({ products }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [inventory, setInventory] = useState<typeof products>(products);
  const memoPriceDown = useCallback(
    () => products.sort((a, b) => a.price - b.price),
    products
  );
  const memoPriceUp = useCallback(
    () => products.sort((a, b) => b.price - a.price),
    products
  );

  return (
    <div className="pt-24 px-2 sm:px-8">
      <div className="flex justify-between pb-2">
        <button>Browse All</button>
        <div>
          <SelectMenu
            width="140px"
            title="Sort"
            options={[
              {
                name: 'Featured',
                icon: iFeatured,
                action: () => {
                  setInventory(products);
                },
              },
              {
                name: 'Price Up',
                icon: iTrendUp,
                action: () => {
                  setInventory([...memoPriceUp()]);
                },
              },
              {
                name: 'Price Down',
                icon: iTrendDown,
                action: () => {
                  setInventory([...memoPriceDown()]);
                },
              },
            ]}
          ></SelectMenu>
        </div>
      </div>
      <Listing products={inventory}></Listing>
    </div>
  );
};

export const getStaticProps = async () => {
  const products = await productsRequest();

  return { props: { products } };
};

export default Shop;
