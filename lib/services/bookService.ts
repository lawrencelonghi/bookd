import { prisma } from "@/lib/prisma";
import { BookStatus, RemoveBookRequest, type AddBookRequest } from "@/types/book";

export class BookService {
  static async addBookToShelf(userId: string, bookData: AddBookRequest) {
    let book = await prisma.book.findUnique({
      where: { googleBooksId: bookData.googleBooksId}
    })

    if(!book) {
      book = await prisma.book.create({
        data:  {
          googleBooksId: bookData.googleBooksId,
          title: bookData.title,
          authors: bookData.authors || [],
          imageUrl: bookData.imageUrl,
          publishedDate: bookData.publishedDate,
          description: bookData.description || null,
          pageCount: bookData.pageCount,
          categories: bookData.categories || [],
          publisher: bookData.publisher,
        }
      })
    }

    const existingUserBook = await prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId: book.id
        }
      }
    })

    if(existingUserBook) {
      return await prisma.userBook.update({
        where: { id: existingUserBook.id },
        data: { status: bookData.status },
        include: { book: true }
      })
    }

    return await prisma.userBook.create({
      data: {
        userId,
        bookId: book.id,
        status: bookData.status
      },
      include: { book: true }
    });
  }
 static async removeBookFromShelf(userId: string, bookData: RemoveBookRequest) {
    const book = await prisma.book.findUnique({
      where: { googleBooksId: bookData.googleBooksId }
    });

     if (!book) {
      throw new Error("Book not found");
    }

       return await prisma.userBook.deleteMany({
      where: {
        userId,
        bookId: book.id
      }
    });
  }

   static async updateBookStatus(userId: string, googleBooksId: string, status: BookStatus) {
    const book = await prisma.book.findUnique({
      where: { googleBooksId }
    });

    if (!book) {
      throw new Error("Book not found");
    }

    return await prisma.userBook.update({
      where: {
        userId_bookId: {
          userId,
          bookId: book.id
        }
      },
      data: { status },
      include: { book: true }
    });
  }

  // busca todos os livros do usuário com filtro opcional por status
  static async getUserBooks(userId: string, status?: BookStatus) {
    return await prisma.userBook.findMany({
      where: {
        userId,
        ...(status && { status })
      },
      include: { book: true },
      orderBy: { updatedAt: 'desc' }
    });
  }

  // verifica se o usuário tem um livro específico
  static async checkUserHasBook(userId: string, googleBooksId: string) {
    const book = await prisma.book.findUnique({
      where: { googleBooksId }
    });

    if (!book) return null;

    return await prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId: book.id
        }
      },
      include: { book: true }
    });
  }

  // busca múltiplos livros do usuário por IDs do Google Books
  static async getUserBooksByGoogleIds(userId: string, googleBooksIds: string[]) {
    const books = await prisma.book.findMany({
      where: {
        googleBooksId: { in: googleBooksIds }
      }
    });

    const bookIds = books.map(b => b.id);

    const userBooks = await prisma.userBook.findMany({
      where: {
        userId,
        bookId: { in: bookIds }
      },
      include: { book: true }
    });
    return userBooks
  }
  }
