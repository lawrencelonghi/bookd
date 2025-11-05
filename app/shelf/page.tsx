'use client'
import { Tabs, Tab } from "@heroui/tabs";
import { useAuth } from "../contexts/AuthContext";
import React from "react";
import Image from "next/image";
import { BookStatus } from "@/types/book";
import { Button } from "@heroui/button";

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
  const [updatingBooks, setUpdatingBooks] = React.useState<Set<string>>(new Set());


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

  const handleUpdateStatus = async (userBook: UserBook, newStatus: BookStatus) => {
    const bookId = userBook.book.googleBooksId

    setUpdatingBooks(prev => new Set(prev).add(bookId));

    try {
      const response = await fetch("/api/books/update-status", {
        method: "PATCH",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
          googleBooksId: bookId,
          status: newStatus
        })
      })

    if (!response.ok) {
      const data = await response.json();
      alert(data.error || "Failed to update book status");
      return;
      }
    
    const updateBook = { ...userBook, status: newStatus }  

    if (userBook.status === BookStatus.WANT_TO_READ) {
        setWantToReadBooks(prev => prev.filter(b => b.book.googleBooksId !== bookId));
      } else if (userBook.status === BookStatus.READING) {
        setReadingBooks(prev => prev.filter(b => b.book.googleBooksId !== bookId));
      } else if (userBook.status === BookStatus.READ) {
        setReadBooks(prev => prev.filter(b => b.book.googleBooksId !== bookId));
    }

   if (newStatus === BookStatus.WANT_TO_READ) {
      setWantToReadBooks(prev => [...prev, updateBook]);
    } else if (newStatus === BookStatus.READING) {
      setReadingBooks(prev => [...prev, updateBook]);
    } else if (newStatus === BookStatus.READ) {
      setReadBooks(prev => [...prev, updateBook]);
    }

    } catch (error) {
      console.error("Error updating book status:", error);
      alert("Failed to update book status");
    }  finally {
      // Remove loading
      setUpdatingBooks(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }

  }

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

  const renderBookGrid = (books: UserBook[], currentStatus: BookStatus) => {
    if (books.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No books in this category yet
        </div>
      );
    }

    return (
      <div className="flex gap-5 flex-wrap mt-18">
        {books.map((userBook) => {
           const isUpdating = updatingBooks.has(userBook.book.googleBooksId);
          return (
                        <div key={userBook.id} className="flex flex-col gap-2">
              <div 
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
              
              {/* Botões baseados no status atual */}
              {currentStatus === BookStatus.WANT_TO_READ && (
                <Button 
                  size="sm" 
                  variant="bordered" 
                  className="hover:bg-green-500"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus(userBook, BookStatus.READING)}
                >
                  Read Now
                </Button>
              )}

              {currentStatus === BookStatus.READING && (
                <Button 
                  size="sm" 
                  variant="bordered" 
                  className="hover:bg-blue-500"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus(userBook, BookStatus.READ)}
                >
                  Mark as Read
                </Button>
              )}

              {currentStatus === BookStatus.READ && (
                <Button 
                  size="sm" 
                  variant="bordered" 
                  className="hover:bg-yellow-500"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus(userBook, BookStatus.READING)}
                >
                  Read Again
                </Button>
              )}
            </div>
          )
      })}
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
          title={`Want to Read (${wantToReadBooks.length})`}
        >
          {renderBookGrid(wantToReadBooks, BookStatus.WANT_TO_READ)}
        </Tab>

        <Tab 
          key="reading" 
          title={`Reading (${readingBooks.length})`}
        >
          {renderBookGrid(readingBooks, BookStatus.READING)}
        </Tab>

        <Tab 
          key="read" 
          title={`Read (${readBooks.length})`}
        >
          {renderBookGrid(readBooks, BookStatus.READ)}
        </Tab>
      </Tabs>
    </section>
  );
};

export default ShelfPage;