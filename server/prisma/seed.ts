import { PrismaClient, Prisma } from '@prisma/client';
import type { Product } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.product.deleteMany({});
  await prisma.product.createMany({
    data: [
      {
        id: 1,
        title: 'Hooded Jacket',
        description:
          'The hooded jacket has large external pockets and an internal pocket for a smartphone, as well as many other features. Flaps over zipper pockets prevent penetration of water. A reflective detail on the back makes sure you can be seen in the dark. Functionality for everyday life in the city.',
        price: new Prisma.Decimal(220),
        category: ['men', 'jacket'],
        tags: ['polyester', 'waterproof'],
        img: ['A1.jpg', 'A2.jpg', 'A3.jpg'],
        stock: 5,
      },
      {
        id: 2,
        title: 'Insulated Light-Weight Jacket',
        description:
          " A high-performance insulating jacket with synthetic filling for mountaineering, climbing or skiing. The helmet-compatible hood provides additional warmth. A PFC-free waterproofing treatment makes the jacket water-repellent. The external pockets are positioned to be harness-compatible. Whenever you don't need the jacket, you can simply compress it for storage in the side pocket. Ideal as an insulating layer in the layering system because it provides generous amounts of warmth despite its light weight.",
        price: new Prisma.Decimal(300),
        category: ['men', 'jacket'],
        tags: ['polyester', 'skiing', 'climbing', 'hiking'],
        img: ['B1.jpg', 'B2.jpg', 'B3.jpg'],
        stock: 4,
      },
      {
        id: 3,
        title: 'Hooded Parka Women',
        description:
          'The Hooded Parka keeps you reliably warm with the help of fiber insulation. Wind and waterproof 2-layer outer material. Waist and fit are adjustable and an internal pocket as well as two front pockets. The Hooded Parka is an urban winter jacket that keeps you warm and dry.',
        price: new Prisma.Decimal(280),
        category: ['women', 'jacket'],
        tags: ['waterproof', 'polyester'],
        img: ['C1.jpg', 'C2.jpg', 'C3.jpg'],
        stock: 10,
      },
      {
        id: 4,
        title: 'Thermo Parka',
        description:
          'Waterproof down jacket that keeps you warm and dry. No water penetration, no loss of down. Precise body mapping for the insulation zones.',
        price: new Prisma.Decimal(600),
        category: ['women', 'jacket'],
        tags: ['polyester', 'goose', 'down'],
        img: ['D1.jpg', 'D2.jpg', 'D3.jpg'],
        stock: 4,
      },
      {
        id: 5,
        title: 'Hiking Boots',
        description:
          'For technical winter terrain. With a winter-specific rubber mix that ensures improved support and increased grip, even on icy surfaces. Membrane prevents the penetration of water. The warm lining provides the shoe with insulation and heat performance in winter, and is guaranteed to counteract cold feet.',
        price: new Prisma.Decimal(180),
        category: ['men', 'boots'],
        tags: ['hiking', 'waterproof'],
        img: ['E1.jpg', 'E2.jpg', 'E3.jpg'],
        stock: 3,
      },
      {
        id: 6,
        title: 'M Boots',
        description:
          'Technical mountaineering boot with a crampon insert on the heel for mountain hiking. The sole design offers outstanding grip and reduced weight. Waterproof and breathable. Built with sustainability and high-quality materials.',
        price: new Prisma.Decimal(300),
        category: ['men', 'boots'],
        tags: ['mountaineering', 'hiking'],
        img: ['F1.jpg', 'F2.jpg', 'F3.jpg'],
        stock: 2,
      },
      {
        id: 7,
        title: 'Winter Boots Women',
        description:
          "A warm shoe for winter that keeps the cold out and ensures that feet remain dry and warm. The shoe's knitted construction eliminates the need for seams which reduces the weight and increases comfort. No lacing ensures that the boot offers super easy entry and is quick to put on and take off.",
        price: new Prisma.Decimal(220),
        category: ['women', 'boots'],
        tags: ['waterproof'],
        img: ['G1.jpg', 'G2.jpg', 'G3.jpg'],
        stock: 12,
      },
      {
        id: 8,
        title: 'Low Kicks',
        description:
          'An everyday shoe for the warm season. Features an outsole made from a Michelin rubber blend for optimum grip, damping thanks to the midsole, high stability with a TPU heel stabilizer and a lightweight, high-quality shaft material. The knitted shaft provides greater breathability, flexibility and comfort for a great summer feeling.',
        price: new Prisma.Decimal(130),
        category: ['women', 'shoes'],
        tags: ['casual', 'summer'],
        img: ['H1.jpg', 'H2.jpg', 'H3.jpg'],
        stock: 4,
      },
      {
        id: 9,
        title: '3 in 1 Glove',
        description:
          'The versatile glove with a 3-in-1 design. The outer glove is made from waterproof membrane and has a warm insulation. Features leather in the palm area. The inner glove provides extra insulation. Features touchscreen compatibility.',
        price: new Prisma.Decimal(180),
        category: ['men', 'women', 'accessories'],
        tags: ['gloves', 'waterproof'],
        img: ['I1.jpg', 'I2.jpg', 'I3.jpg'],
        stock: 7,
      },
      {
        id: 10,
        title: 'Neck Gaiter',
        description:
          'The neck gaiter can be pulled to cover the face in extreme conditions. Air holes for extra comfort.',
        price: new Prisma.Decimal(45),
        category: ['men', 'accessories'],
        tags: ['scarf'],
        img: ['J1.jpg', 'J2.jpg', 'J3.jpg'],
        stock: 8,
      },
      {
        id: 11,
        title: 'Beanie',
        description: 'A beanie made from wool-acrylic',
        price: new Prisma.Decimal(38),
        category: ['women', 'accessories'],
        tags: ['beanie'],
        img: ['K1.jpg', 'K2.jpg', 'K3.jpg'],
        stock: 6,
      },
      {
        id: 12,
        title: 'Winter Gloves',
        description:
          'Suitable for a variety of activities all year round. The gloves protect your hands when hiking, skiing and climbing as well as when you’re biking or running. Windproof and breathable. The pre-shaped design adapts to the natural shape of the hand and ensures a tight fit. Touchscreen-compatible.',
        price: new Prisma.Decimal(40),
        category: ['men', 'women', 'accessories'],
        tags: ['gloves', 'water reppellent'],
        img: ['L1.jpg', 'L2.jpg', 'L3.jpg'],
        stock: 4,
      },
      {
        id: 13,
        title: 'Long Tights Men',
        description:
          'The wool content insulates and inhibits odors, the synthetic fibers make the tights durable and ensure that the material dries quickly. Seamless construction allows a body zone-specific arrangement of different material structures for regulation of your body temperature.',
        price: new Prisma.Decimal(100),
        category: ['men', 'pants'],
        tags: ['base layer'],
        img: ['M1.jpg', 'M2.jpg', 'M3.jpg'],
        stock: 9,
      },
      {
        id: 14,
        title: 'Cotton Pants',
        description:
          ' Casual climbing pants. Super stretch and a relaxed fit create comfort. Features adjustable waistband. ',
        price: new Prisma.Decimal(95),
        category: ['men', 'pants'],
        tags: ['climbing', 'hiking'],
        img: ['N1.jpg', 'N2.jpg', 'N3.jpg'],
        stock: 6,
      },
      {
        id: 15,
        title: 'Long Tights Women',
        description:
          'Features a wool/polyamide blend. The wool content insulates and inhibits odors, the synthetic fibers make the tights durable and ensure that the material dries quickly. Seamless construction allows a body zone-specific arrangement of different material structures for regulation of your body temperature.',
        price: new Prisma.Decimal(95),
        category: ['women', 'pants'],
        tags: ['base layer'],
        img: ['O1.jpg', 'O2.jpg', 'O3.jpg'],
        stock: 8,
      },
      {
        id: 16,
        title: 'Hiking Pants',
        description:
          'The insulating material is complemented by ventilation openings on the outer leg for regulating body temperature. The 4-way stretch material provides great freedom of movement.',
        price: new Prisma.Decimal(0),
        category: ['women', 'pants'],
        tags: ['polyester'],
        img: ['P1.jpg', 'P2.jpg', 'P3.jpg'],
        stock: 0,
      },
      {
        id: 17,
        title: 'Longsleeve Shirt',
        description:
          'A warm flannel long-sleeve shirt made from organic cotton. It is equipped with a front zipper instead of the typical button facing. Ideal as a warm mid-layer.',
        price: new Prisma.Decimal(130),
        category: ['men', 'shirt'],
        tags: ['casual'],
        img: ['Q1.jpg', 'Q2.jpg', 'Q3.jpg'],
        stock: 10,
      },
      {
        id: 18,
        title: 'T-Shirt',
        description: 'A blend of 90% organic cotton and 10% spandex.',
        price: new Prisma.Decimal(25),
        category: ['men', 'shirt'],
        tags: ['casual'],
        img: ['R1.jpg', 'R2.jpg', 'R3.jpg'],
        stock: 7,
      },
      {
        id: 19,
        title: 'Hiking T-Shirt',
        description:
          'Ideal for hiking and sporting activities. Features an antimicrobial treatment designed to keep unpleasant odors at bay.',
        price: new Prisma.Decimal(45),
        category: ['women', 'shirt'],
        tags: ['casual'],
        img: ['S1.jpg', 'S2.jpg', 'S3.jpg'],
        stock: 2,
      },
      {
        id: 20,
        title: 'T-Shirt Women',
        description:
          'Features a Merino wool/polyamide blend. The wool content insulates and inhibits odors, the synthetic fibers make the T-shirt durable and ensure that the material dries quickly. Seamless construction allows a body zone-specific arrangement of different material structures for optimal regulation of your body temperature. ',
        price: new Prisma.Decimal(80),
        category: ['women', 'shirt'],
        tags: ['casual', 'base layer'],
        img: ['T1.jpg', 'T2.jpg', 'T3.jpg'],
        stock: 11,
      },
    ],
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
