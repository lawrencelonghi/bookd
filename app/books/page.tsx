import { BookCard } from "@/components/books/bookCard";
import { BookList } from "@/components/books/bookList";
import { title } from "@/components/primitives";
import { BookModalProvider } from "./_components/book-modal-context";
import SearchInput from "@/components/searchInput";

const BooksPage = () => {
  return (
   <BookModalProvider>
    <div>
    <div className="flex flex-col gap-14 py-8 items-center justify-center mb-10">
    <h1 className={title({ size: "sm" })}>Find what interests you.</h1>
    <SearchInput/>
    </div>    
     <BookList/>
  </div>
  </BookModalProvider>
  )
};

export default BooksPage;
