'use client'
import { Tabs, Tab } from "@heroui/tabs";
import { useAuth } from "../contexts/AuthContext";
import React from "react";
import Image from "next/image";
import { BookStatus } from "@/types/book";

interface UserBook {
  id: string;
  status: string;
  book: {
    id: string;
    googleBooksId: string;
    title: string;
    authors: string[];
    imageUrl?: string;
    publishedDate?: string;
  };
}

const ShelfPage = () => {
  const { user, isCheckingAuth } = useAuth();
  const [readingBooks, setReadingBooks] = React.useState<UserBook[]>([]);
  const [wantToReadBooks, setWantToReadBooks] = React.useState<UserBook[]>([]);
  const [readBooks, setReadBooks] = React.useState<UserBook[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      loadUserBooks();
    } else if (!isCheckingAuth) {
      setLoading(false);
    }
  }, [user, isCheckingAuth]);

  const loadUserBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/books/user-books");
      
      if (response.ok) {
        const data = await response.json();
        const books: UserBook[] = data.userBooks;
        
        setReadingBooks(books.filter(b => b.status === BookStatus.READING));
        setWantToReadBooks(books.filter(b => b.status === BookStatus.WANT_TO_READ));
        setReadBooks(books.filter(b => b.status === BookStatus.READ));
      }
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth || loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg">Loading your shelf...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg">Please sign in to view your shelf</p>
      </div>
    );
  }

  const renderBookGrid = (books: UserBook[]) => {
    if (books.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No books in this category yet
        </div>
      );
    }

    return (
      <div className="flex gap-5 flex-wrap mt-8">
        {books.map((userBook) => (
          <div 
            key={userBook.id}
            className="relative w-[150px] h-[230px] overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <Image
              alt={userBook.book.title}
              className="object-cover"
              src={userBook.book.imageUrl || '/placeholder-book.png'}
              fill
              sizes="150px"
              quality={100}
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p className="text-white text-xs font-semibold line-clamp-2">
                {userBook.book.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="flex items-center justify-center mt-18 flex-col">
      
      <Tabs 
        aria-label="Book shelves" 
        size="lg" 
        variant="bordered"
      >
        <Tab 
          key="want-to-read" 
          title={`Want to Read`}
        >
          {renderBookGrid(wantToReadBooks)}
        </Tab>

        <Tab 
          key="reading" 
          title={`Reading`}
        >
          {renderBookGrid(readingBooks)}
        </Tab>

        <Tab 
          key="read" 
          title={`Read`}
        >
          {renderBookGrid(readBooks)}
        </Tab>
      </Tabs>
    </section>
  );
};

export default ShelfPage;