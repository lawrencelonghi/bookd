import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { BookService } from "@/lib/services/bookService";
import { AddBookRequest } from "@/types/book";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const bookData: AddBookRequest = await request.json();

    if (!bookData.googleBooksId || !bookData.title || !bookData.status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userBook = await BookService.addBookToShelf(
      currentUser.userId,
      bookData
    );

    return NextResponse.json(
      { 
        message: "Book added successfully",
        userBook 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Add book error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}