import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { BookService } from "@/lib/services/bookService";
import { BookStatus } from "@/types/book";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as BookStatus | null;

    const userBooks = await BookService.getUserBooks(
      currentUser.userId,
      status || undefined
    );

    return NextResponse.json({ userBooks }, { status: 200 });
  } catch (error) {
    console.error("Fetch user books error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { googleBooksIds } = await request.json();

    if (!Array.isArray(googleBooksIds)) {
      return NextResponse.json(
        { error: "googleBooksIds must be an array" },
        { status: 400 }
      );
    }

    const userBooks = await BookService.getUserBooksByGoogleIds(
      currentUser.userId,
      googleBooksIds
    );

    return NextResponse.json({ userBooks }, { status: 200 });
  } catch (error) {
    console.error("Fetch user books by IDs error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}