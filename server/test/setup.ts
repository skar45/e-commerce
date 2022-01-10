import { PrismaClient, Product, Prisma } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import jwt from 'jsonwebtoken';
import { clearCache, redisDisconnect } from '../lib/redis';
// import prisma from '../lib/prisma';
// jest.mock('../lib/prisma', () => ({
//   __esModule: true,

//   default: mockDeep<PrismaClient>(),
// }));

type removeId<T> = {
  [Property in keyof T as Exclude<Property, 'id'>]: T[Property];
};

const prisma = new PrismaClient();

beforeAll(async () => {
  const products: Product[] = [];
  for (let i = 0; i < 5; i++) {
    products.push({
      id: i + 1,
      title: `product-${i}`,
      description: `desc-${i}`,
      category: [`cat-${i}`],
      tags: [`tag-mock`],
      stock: i + 1,
      img: ['cat.jpg'],
      price: new Prisma.Decimal(4.2 * i),
    });
  }
  const seedProducts = await prisma.product.createMany({
    data: products,
  });
});

afterAll(async () => {
  await prisma.product.deleteMany({});
  await prisma.$disconnect();
  await redisDisconnect();
});

beforeEach(async () => {});

afterEach(async () => {
  await prisma.user.deleteMany({});
  await prisma.listItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.wishList.deleteMany({});
  await clearCache();
});
