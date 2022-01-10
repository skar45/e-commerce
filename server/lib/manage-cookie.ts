import { ListItem } from '.prisma/client';
import prisma from './prisma';

type cartCookie = { [key: number]: { amount: number } };

export const loginCookie = async (
  cart: cartCookie,
  userId: number,
  listItem: ListItem[]
) => {
  const findCartId = (id: number) => {
    return listItem.filter((v) => v.productId === id);
  };

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ListItem: {
        upsert: Object.entries(cart).map(([id, { amount }]) => {
          return {
            update: {
              productId: parseInt(id),
              amount: { increment: amount },
            },
            where: {
              id: findCartId(parseInt(id))[0]
                ? findCartId(parseInt(id))[0].id
                : -1,
            },
            create: {
              productId: parseInt(id),
              amount,
            },
          };
        }),
      },
    },
    include: {
      ListItem: {
        include: {
          Product: {
            select: {
              title: true,
              price: true,
            },
          },
        },
      },
    },
  });
  return updatedUser;
};
