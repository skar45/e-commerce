import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import { getCategoryRequest } from '../api/requests';
import Listing from '../components/listing';

type Props<T extends (...args) => any> = ReturnType<T> extends Promise<{
  props: infer F;
}>
  ? F
  : never;

const CategoryList = ({ products }: Props<typeof getServerSideProps>) => {
  return (
    <div className="pt-24 px-2 sm:px-8">
      <Listing products={products} />
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { category, tag } = context.query;
  // let cat: string = null;
  // let t: string = null;

  // if (category) cat = category.toString();
  // if (tag) t = tag.toString();

  const response = await getCategoryRequest(
    category ? category.toString() : null,
    tag ? tag.toString() : null
  );

  return {
    props: {
      products: response,
    },
  };
};

export default CategoryList;
