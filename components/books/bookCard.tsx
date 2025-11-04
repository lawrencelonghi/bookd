'use client';

// import { Card, CardHeader, CardBody } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBookModal } from '../../app/books/_components/book-modal-context';
import { FetchGoogleBooks } from "@/app/api/googleBooks/booksApi";

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
    <>
    
      <div 
        className="relative w-[150px] h-[230px] overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    
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
      <p>{book.id}</p>
      </div>

      
    </>
  );
};