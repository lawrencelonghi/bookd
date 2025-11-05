'use client'
import React from "react";
import { Search, Star } from "lucide-react";
import { Input } from "@heroui/input";
import { FetchGoogleBooks } from "@/app/api/googleBooks/booksApi";
import { Book } from "./bookCard";
import { BookStatus } from "@/types/book";
import { useAuth } from "@/app/contexts/AuthContext";

const SearchInput = () => {
  const { user } = useAuth();
  const [inputValue, setInputValue] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<Book[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [savedBooks, setSavedBooks] = React.useState<Set<string>>(new Set());
  const [loadingSaves, setLoadingSaves] = React.useState<Set<string>>(new Set());
  const searchTimeoutRef = React.useRef<number>();

  // Carrega os livros salvos do usuário quando componente monta
  React.useEffect(() => {
    if (user) {
      loadUserBooks();
    }
  }, [user]);

  const loadUserBooks = async () => {
    try {
      const response = await fetch("/api/books/user-books");
      if (response.ok) {
        const data = await response.json();
        const bookIds = new Set<string>(
          data.userBooks.map((ub: any) => ub.book.googleBooksId)
        );
        setSavedBooks(bookIds);
      }
    } catch (error) {
      console.error("Error loading user books:", error);
    }
  };

  const handleSaveBook = async (book: Book) => {
    if (!user) {
      alert("Please sign in to save books");
      return;
    }

    const bookId = book.id;
    setLoadingSaves(prev => new Set(prev).add(bookId));

    try {
      if (savedBooks.has(bookId)) {
        // Remove do banco (implementar endpoint de remoção se necessário)
        setSavedBooks(prev => {
          const newSet = new Set(prev);
          newSet.delete(bookId);
          return newSet;
        });
      } else {
        // Adiciona ao banco
        const response = await fetch("/api/books/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleBooksId: bookId,
            title: book.title,
            authors: book.authors,
            imageUrl: book.imageUrl,
            publishedDate: book.publishedDate,
            description: book.description,
            pageCount: book.pageCount,
            categories: book.categories,
            publisher: book.publisher,
            status: BookStatus.WANT_TO_READ
          })
        });

        if (response.ok) {
          setSavedBooks(prev => new Set(prev).add(bookId));
        } else {
          const data = await response.json();
          alert(data.error || "Failed to save book");
        }
      }
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Failed to save book");
    } finally {
      setLoadingSaves(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }
  };

  async function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const newSearchInputValue = e.target.value;
    setInputValue(newSearchInputValue);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (newSearchInputValue.trim()) {
      setIsSearching(true);
      setShowResults(true);
      searchTimeoutRef.current = window.setTimeout(async () => {
        try {
          const data = await FetchGoogleBooks(newSearchInputValue, 40);
          const results: Book[] = data.items?.map((item: any) => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            imageUrl: item.volumeInfo.imageLinks?.thumbnail,
            publishedDate: item.volumeInfo.publishedDate,
            description: item.volumeInfo.description,
            pageCount: item.volumeInfo.pageCount,
            categories: item.volumeInfo.categories,
            publisher: item.volumeInfo.publisher,
            book: item.volumeInfo.title
          })) || [];
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  }

  return (
    <div className="relative">
      <Input
        classNames={{
          base: "max-w-full sm:max-w-[18rem] mt-1 h-10",
          mainWrapper: "h-full",
          input: "text-small",
          inputWrapper:
            "h-full font-normal text-default-500 bg-default-400/10 dark:bg-default-500/10",
        }}
        radius="full"
        isClearable
        size="md"
        startContent={<Search size={18} />} 
        type="search"
        value={inputValue}
        onChange={handleSearchInput}
        onClear={() => {
          setInputValue("");
          setShowResults(false);
          setSearchResults([]);
        }}
      />
      
      {showResults && (
        <div className="absolute top-full mt-2 w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 border border-gray-200 dark:border-gray-700">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700 ">
              {searchResults.map((result) => (
                <div 
                  key={result.id} 
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="flex gap-3">
                    {result.imageUrl && (
                      <img 
                        src={result.imageUrl} 
                        alt={result.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm line-clamp-1">
                        {result.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        by {result.authors?.join(', ') || 'Unknown Author'}
                      </p>
                      {result.publishedDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          {result.publishedDate}
                        </p>
                      )}
                    </div>
                    <div className="flex items-end">
                      <button 
                        onClick={() => handleSaveBook(result)}
                        disabled={loadingSaves.has(result.id)}
                        className="transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {loadingSaves.has(result.id) ? (
                          <div className="w-[18px] h-[18px] border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Star 
                            size={18}
                            className={savedBooks.has(result.id) 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-gray-400 hover:text-yellow-400"
                            }
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;