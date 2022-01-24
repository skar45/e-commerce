import { MouseEvent } from 'react';
import { iAccount, iStar, iStarOut } from './Icons';
import { delReviewRequest, showProductRequest } from '../api/requests';
import { useStore } from '../store/user-context';
import { ActionTypes } from './types';

type PromiseGen<g> = g extends Promise<infer U> ? U : never;
type Product = PromiseGen<ReturnType<typeof showProductRequest>>;

export const ReviewCard = ({ data }: { data: Product['Review'][number] }) => {
  const [store, dispatch] = useStore();

  const handleRevDel = async (e: MouseEvent) => {
    const response = await delReviewRequest({ reviewId: data.id });
    if ('error' in response) return;
    dispatch({ type: ActionTypes.delReview, review: response });
  };

  return (
    <div className="flex flex-col gap-2 bg-white p-1">
      <hr />
      <div className="flex gap-2">
        <i>{iAccount}</i>
        <span className="">{data.User.username}</span>
      </div>
      <h2 className="font-bold">{data.title}</h2>
      <div className="flex">
        {Array(5)
          .fill(iStar, 0, data.rating)
          .fill(iStarOut, data.rating, 5)
          .map((s, i) => (
            <i key={i}>{s}</i>
          ))}
      </div>
      <p>{data.description}</p>
      {store.username === data.User.username && (
        <button
          className="bg-red-500 p-2 text-white text-sm rounded-lg w-max"
          onClick={handleRevDel}
        >
          Delete
        </button>
      )}
      <hr />
    </div>
  );
};
