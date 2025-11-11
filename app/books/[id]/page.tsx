'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@heroui/button';
import { Star, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { BookStatus } from '@/types/book';

interface BookDetails {
  id: string;
  title: string;
  authors?: string[];
  imageUrl?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  publisher?: string;
  averageRating?: number;
  ratingsCount?: number;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookId = params.id as string;

  const [book, setBook] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<BookStatus | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (bookId) {
      loadBookDetails();
      if (user) {
        checkIfBookIsSaved();
      }
    }
  }, [bookId, user]);

  const loadBookDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${bookId}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch book');
      
      const data = await response.json();
      const volumeInfo = data.volumeInfo;

      setBook({
        id: data.id,
        title: volumeInfo.title,
        authors: volumeInfo.authors,
        imageUrl: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
        publishedDate: volumeInfo.publishedDate,
        description: volumeInfo.description,
        pageCount: volumeInfo.pageCount,
        categories: volumeInfo.categories,
        publisher: volumeInfo.publisher,
        averageRating: volumeInfo.averageRating,
        ratingsCount: volumeInfo.ratingsCount,
      });
    } catch (error) {
      console.error('Error loading book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfBookIsSaved = async () => {
    try {
      const response = await fetch('/api/books/user-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleBooksIds: [bookId] }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.userBooks && data.userBooks.length > 0) {
          setIsSaved(true);
          setCurrentStatus(data.userBooks[0].status as BookStatus);
        }
      }
    } catch (error) {
      console.error('Error checking book status:', error);
    }
  };

  const handleSaveBook = async (status: BookStatus) => {
    if (!user) {
      alert('Please sign in to save books');
      return;
    }

    setSaving(true);

    try {
      if (isSaved) {
        const response = await fetch('/api/books/update-status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            googleBooksId: bookId,
            status: status,
          }),
        });

        if (response.ok) {
          setCurrentStatus(status);
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to update book');
        }
      } else {
        const response = await fetch('/api/books/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            googleBooksId: bookId,
            title: book?.title,
            authors: book?.authors,
            imageUrl: book?.imageUrl,
            publishedDate: book?.publishedDate,
            description: book?.description,
            pageCount: book?.pageCount,
            categories: book?.categories,
            publisher: book?.publisher,
            status: status,
          }),
        });

        if (response.ok) {
          setIsSaved(true);
          setCurrentStatus(status);
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to save book');
        }
      }
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg">Book not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Button
        variant="light"
        startContent={<ArrowLeft size={20} />}
        onPress={() => router.back()}
        className="mb-6"
      >
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Imagem do livro */}
        <div className="md:col-span-1">
          <div className="relative w-full aspect-[2/3] max-w-[300px] mx-auto">
            <Image
              src={book.imageUrl || '/placeholder-book.png'}
              alt={book.title}
              fill
              className="object-cover shadow-xl"
              priority
            />
          </div>

          {/* Botões de ação */}
          {user && (
            <div className="mt-6 space-y-3">
              <Button
                fullWidth
                color={currentStatus === BookStatus.WANT_TO_READ ? 'primary' : 'default'}
                variant={currentStatus === BookStatus.WANT_TO_READ ? 'solid' : 'bordered'}
                isLoading={saving}
                onPress={() => handleSaveBook(BookStatus.WANT_TO_READ)}
              >
                {currentStatus === BookStatus.WANT_TO_READ ? 'Want to Read ✓' : 'Want to Read'}
              </Button>

              <Button
                fullWidth
                color={currentStatus === BookStatus.READING ? 'success' : 'default'}
                variant={currentStatus === BookStatus.READING ? 'solid' : 'bordered'}
                isLoading={saving}
                onPress={() => handleSaveBook(BookStatus.READING)}
              >
                {currentStatus === BookStatus.READING ? 'Reading ✓' : 'Currently Reading'}
              </Button>

              <Button
                fullWidth
                color={currentStatus === BookStatus.READ ? 'secondary' : 'default'}
                variant={currentStatus === BookStatus.READ ? 'solid' : 'bordered'}
                isLoading={saving}
                onPress={() => handleSaveBook(BookStatus.READ)}
              >
                {currentStatus === BookStatus.READ ? 'Read ✓' : 'Mark as Read'}
              </Button>
            </div>
          )}
        </div>

        {/* Informações do livro */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
          
          {book.authors && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              by {book.authors.join(', ')}
            </p>
          )}

          {book.averageRating && (
            <div className="flex items-center gap-2 mb-4">
              <Star className="fill-yellow-400 text-yellow-400" size={20} />
              <span className="text-lg font-semibold">{book.averageRating}</span>
              {book.ratingsCount && (
                <span className="text-gray-600 dark:text-gray-400">
                  ({book.ratingsCount} ratings)
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
            {book.publishedDate && (
              <span>Published: {book.publishedDate}</span>
            )}
            {book.pageCount && (
              <span>Pages: {book.pageCount}</span>
            )}
            {book.publisher && (
              <span>Publisher: {book.publisher}</span>
            )}
          </div>

          {book.categories && book.categories.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Categories:</h3>
              <div className="flex flex-wrap gap-2">
                {book.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700/30 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {book.description && (
            <div>
              <h3 className="font-semibold text-xl mb-3">About this book</h3>
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: book.description }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}