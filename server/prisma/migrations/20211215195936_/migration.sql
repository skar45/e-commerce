/*
  Warnings:

  - Added the required column `price` to the `ListItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ListItem" ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;
