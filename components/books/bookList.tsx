'use client';

import { BookCard } from "./bookCard";
import { useEffect, useState } from "react";
import type { Book } from "./bookCard";
import { FetchGoogleBooks } from "@/app/api/googleBooks/booksApi";
import { log } from "console";

interface GoogleBooksResponse {
  items?: Array<{
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      imageLinks?: {
        thumbnail: string;
      };
    };
  }>;
}

export const BookList = () => {

  const [classicBooks, setClassicBooks] = useState<Book[]>([]);
  const [fictionBooks, setFictionBooks] = useState<Book[]>([]);
  const [biographyBooks, setBiographyBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const transformGoogleBook = (item: any): Book => ({
  id: item.id,
  title: item.volumeInfo.title,
  authors: item.volumeInfo.authors,
  imageUrl: item.volumeInfo.imageLinks?.thumbnail,
  publishedDate: item.volumeInfo.publishedDate,
  description: item.volumeInfo.description,
  pageCount: item.volumeInfo.pageCount,
  categories: item.volumeInfo.categories,
  publisher: item.volumeInfo.publisher,
  book: item.volumeInfo.title // Not sure what this field is for
});

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true)
        const [classics, fiction, biography] = await Promise.all([
        FetchGoogleBooks('subject:classics', 40, 'relevance'),
        FetchGoogleBooks('subject:fiction', 40, 'relevance'),
        FetchGoogleBooks('subject:biography', 40, 'relevance')
        ]);
        setClassicBooks(classics.items?.slice(0, 10).map(transformGoogleBook) || []);
        setFictionBooks(fiction.items?.slice(0, 10).map(transformGoogleBook) || []);
        setBiographyBooks(biography.items?.slice(0, 10).map(transformGoogleBook) || []);
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
    } finally {
        setLoading(false);
      }
    }
      loadBooks()
  },[])

  if (loading) {
    return <div>Loading Books...</div>
  }


  return (
    <main className="flex flex-col gap-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Classics</h2>     
        <div className="flex gap-3 flex-wrap mb-10"> 
          {classicBooks.map((classicBook) => (
            <BookCard key={classicBook.id} book={classicBook}  />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Fiction</h2>     
        <div className="flex gap-3 flex-wrap"> 
          {fictionBooks.map((fictionBook) => (
            <BookCard key={fictionBook.id} book={fictionBook}/>            
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Biography</h2>     
        <div className="flex gap-3 flex-wrap"> 
          {biographyBooks.map((biographyBook) => (
            <BookCard key={biographyBook.id} book={biographyBook} />
          ))}
        </div>
      </section>

    </main>
  )

}

