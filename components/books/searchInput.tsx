'use client'
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@heroui/input";
import { FetchGoogleBooks } from "@/app/api/googleBooks/booksApi";
import { Book } from "./bookCard";
import { setTimeout } from "node:timers/promises";
import { Star } from "lucide-react";

const SearchInput = () => {
  const [inputValue, setInputValue] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<Book[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [showResults, setShowResults] = React.useState(false)
  const [isStarred, setIsStarred] = React.useState(false)
   const [starredBooks, setStarredBooks] = React.useState<Set<string>>(new Set())
  const searchTimeoutRef = React.useRef<number>()

   const toggleStar = (bookId: string) => {
    setStarredBooks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(bookId)) {
        newSet.delete(bookId)
      } else {
        newSet.add(bookId)
      }
      return newSet
    })
  }

  async function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const newSearchInputValue = e.target.value
    setInputValue(newSearchInputValue)

    if(searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    if (newSearchInputValue.trim()) {
      setIsSearching(true)
      setShowResults(true)
      searchTimeoutRef.current = window.setTimeout(async () => {
        try {
          const data = await FetchGoogleBooks(newSearchInputValue, 40)
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
        })) || []
        setSearchResults(results)
    } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, 500)
  } else {
      setShowResults(false)
      setSearchResults([])
    }
  }
    



  return (
     <div className="relative">
      <Input
        classNames={{
          base: "max-w-full sm:max-w-[18rem] mt-12 h-10",
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
          setInputValue("")
          setShowResults(false)
          setSearchResults([])
        }}
      />
      
      {/* Search Results Modal/Dropdown */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 border border-gray-200 dark:border-gray-700">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
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
                        onClick={() => toggleStar(result.id)}
                        className="transition-colors cursor-pointer"
                      >
                        <Star 
                          size={18}
                          className={starredBooks.has(result.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
                        />
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
  )

  

}

export default SearchInput