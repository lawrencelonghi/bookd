import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { BookService } from "@/lib/services/bookService";
import { RemoveBookRequest } from "@/types/book";

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)

    if(!currentUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const bookData: RemoveBookRequest = await request.json()

    if(!bookData.googleBooksId || !bookData.status) {
       return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userBook = await BookService.removeBookFromShelf(
      currentUser.userId,
      bookData
    )

    return NextResponse.json(
      { 
        message: "Book removed successfully",
        userBook 
      },
      { status: 200 }
      );
  } catch (error) {
    console.error("Remove book error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}