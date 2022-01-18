import { PrismaClient } from '@prisma/client';
import type { Prisma, User } from '.prisma/client';
import { dbError } from '../middlewares/errorhandler';
import type { RedisClientType } from '@node-redis/client/dist/lib/client';
import redisClient from './redis';
import e from 'express';

class Client extends PrismaClient {
  public redisCli: RedisClientType;
  constructor(cacheClient: RedisClientType<any>) {
    super();
    this.redisCli = cacheClient;
  }
}

const resetCacheActions: Prisma.PrismaAction[] = [
  'create',
  'update',
  'updateMany',
  'upsert',
  'delete',
  'createMany',
  'deleteMany',
];

const prisma = new Client(redisClient);

prisma.$use(async (params, next) => {
  const str = (s: Object) => (s ? JSON.stringify(s) : '');
  if (!params.model) return;
  const ListItemKey =
    'ListItem:' + params.args?.where?.id
      ? 'Id:' + str(params.args?.where?.id)
      : 'UserId' + str(params.args?.where?.userId);
  const cacheReset = resetCacheActions.includes(params.action);
  let cacheVal: string | undefined | null;

  if (cacheReset) {
    if (params.model === 'User') {
      await redisClient.del('User' + str(params.args?.where?.id));
    }

    if (params.model === ('ListItem' || 'User')) {
      await redisClient.del(ListItemKey);
    } else {
      if (params.model === ('Product' || 'Purchased'))
        await redisClient.del('Product');
      await redisClient.del('Product' + 'Category');
      await redisClient.hDel(
        'Product' + 'Items',
        str(
          params.model === 'Product'
            ? params.args?.where?.id
            : params.args?.data?.productId
        )
      );
      await redisClient.hDel(
        'Product' + 'CartSel',
        str(
          params.model === 'Product'
            ? params.args?.where?.id
            : params.args?.where?.productId
        )
      );
    }
  } else {
    try {
      switch (params.model) {
        case 'User':
          cacheVal = await redisClient.hGet(
            params.model + str(params.args?.where?.id),
            str(params.args || 'none')
          );
          break;
        case 'Product':
          if (params.args?.where?.id) {
            if (params.args.select) {
              cacheVal = await redisClient.hGet(
                params.model + 'CartSel',
                str(params.args.where.id)
              );
            } else {
              cacheVal = await redisClient.hGet(
                params.model + 'Items',
                str(params.args.where.id)
              );
            }
          } else if (params.args?.where?.category) {
            cacheVal = await redisClient.hGet(
              params.model + 'Category',
              str(params.args.where.category)
            );
          } else {
            cacheVal = await redisClient.get(params.model);
          }

          break;
        case 'ListItem':
          cacheVal = await redisClient.hGet(
            ListItemKey,
            str(params.args || 'none')
          );
          break;
      }
    } catch (err) {
      throw dbError();
    }
  }

  if (!cacheVal) {
    const result = await next(params);
    if (!cacheReset) {
      try {
        switch (params.model) {
          case 'User':
            await redisClient.hSet(
              params.model + str(params.args?.where?.id),
              str(params.args || 'none'),
              str(result)
            );
            break;
          case 'Product':
            if (params.args?.where?.id) {
              if (params.args.select) {
                await redisClient.hSet(
                  params.model + 'CartSel',
                  str(params.args.where.id),
                  str(result)
                );
              } else {
                await redisClient.hSet(
                  params.model + 'Items',
                  str(params.args.where.id),
                  str(result)
                );
              }
            } else if (params.args?.where?.category) {
              await redisClient.hSet(
                params.model + 'Category',
                str(params.args.where.category),
                str(result)
              );
            } else {
              await redisClient.set(params.model, str(result));
            }

            break;
          case 'ListItem':
            await redisClient.hSet(
              ListItemKey,
              str(params.args || 'none'),
              str(result)
            );
            break;
        }
      } catch (err) {
        throw dbError();
      }
    } else {
      if (params.model === ('WishList' || 'Review')) {
        await redisClient.hDel('Product' + 'Items', str(result.productId));
        await redisClient.hDel('Product' + 'CartSel', str(result.productId));
        await redisClient.del('User' + str(result.userId));
      } else if (params.model === 'ListItem') {
        await redisClient.del('User' + str(result.userId));
      }
    }

    return result;
  }

  return JSON.parse(cacheVal);
});

export default prisma;
