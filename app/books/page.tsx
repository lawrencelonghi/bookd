import { BookCard } from "@/components/books/bookCard";
import { BookList } from "@/components/books/bookList";
import { title } from "@/components/primitives";
import { Input } from "@heroui/input";
import { Search } from "lucide-react";
import { BookModalProvider } from "./_components/book-modal-context";

const BooksPage = () => {
  return (
   <BookModalProvider>
    <div>
    <div className="flex flex-col gap-6 py-8 items-center justify-center mb-20">
    <h1 className={title({ size: "sm" })}>Find what interests you.</h1>
    <Input
        classNames={{
          base: "max-w-full sm:max-w-[18rem] h-10",
          mainWrapper: "h-full",
          input: "text-small",
          inputWrapper:
            "h-full font-normal text-default-500 bg-default-400/10 dark:bg-default-500/10",
        }}
        radius="full"
        size="md"
        startContent={<Search size={18} />}
        type="search"
      />
    </div>    
     <BookList/>
  </div>
  </BookModalProvider>
  )
};

export default BooksPage;
