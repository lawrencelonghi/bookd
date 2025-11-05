import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { BookService } from "@/lib/services/bookService";
import { BookStatus } from "@/types/book";

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
       return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const {googleBooksId, status} = await request.json()
    if (!googleBooksId || !status) {
      return NextResponse.json(
        { error: "Missing googleBooksId or status" },
        { status: 400 }
      );
    }

    if (!Object.values(BookStatus).includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be WANT_TO_READ, READING, or READ" },
        { status: 400 }
      );
    }

    const userBook = await BookService.updateBookStatus(
      currentUser.userId,
      googleBooksId,
      status
    )

     return NextResponse.json(
      { 
        message: "Book status updated successfully",
        userBook 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update status error:", error);

    if (error.message === "Book not found") {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}