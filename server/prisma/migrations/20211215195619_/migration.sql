/*
  Warnings:

  - The `img` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `userId` on table `ListItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ListItem" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "img",
ADD COLUMN     "img" TEXT[];
