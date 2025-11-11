'use client';

import Image from "next/image";
import Link from "next/link";

export interface Book {
  book: string
  id: string;
  title: string;
  authors?: string[];
  imageUrl?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  publisher?: string;
}

interface BookCardProps {
  book: Book
}

export const BookCard = ({ book }: BookCardProps) => {
  return (
    <Link href={`/books/${book.id}`}>
      <div 
        className="relative w-[150px] h-[230px] border border-gray-500 rounded-sm overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <Image
          alt={book.title}
          className="object-cover"
          src={book.imageUrl || '/placeholder-book.png'}
          fill
          sizes="150px"
          quality={100}
          priority={true}
          style={{ objectFit: 'cover' }}         
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <p className="text-white text-xs font-semibold line-clamp-2">
            {book.title}
          </p>
        </div>
      </div>
    </Link>
  );
};