-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "pageCount" INTEGER,
ADD COLUMN     "publishedDate" TEXT,
ADD COLUMN     "publisher" TEXT;
