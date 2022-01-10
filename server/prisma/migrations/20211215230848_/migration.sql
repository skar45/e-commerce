/*
  Warnings:

  - You are about to drop the column `price` on the `ListItem` table. All the data in the column will be lost.
  - Added the required column `paid` to the `Purchased` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ListItem" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "Purchased" ADD COLUMN     "paid" DECIMAL(65,30) NOT NULL;
