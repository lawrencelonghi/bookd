export enum BookStatus {
  WANT_TO_READ = 'WANT_TO_READ',
  READING = 'READING',
  READ = 'READ'
}

export interface Book {
  id: string;
  googleBooksId: string;
  title: string;
  authors: string[];
  imageUrl?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  publisher?: string;
}

export interface UserBook {
  id: string;
  userId: string;
  bookId: string;
  status: BookStatus;
  book: Book;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddBookRequest {
  googleBooksId: string;
  title: string;
  authors?: string[];
  imageUrl?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  publisher?: string;
  status: BookStatus;
}