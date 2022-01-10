import { iAccount, iStar, iStarOut } from './Icons';
import { showProductRequest } from '../api/requests';

type PromiseGen<g> = g extends Promise<infer U> ? U : never;
type Product = PromiseGen<ReturnType<typeof showProductRequest>>;

export const ReviewCard = ({ data }: { data: Product['Review'][number] }) => {
  return (
    <div className="flex flex-col gap-2">
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
      <hr />
    </div>
  );
};
