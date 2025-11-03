'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface BookModalContextType {
  openBookId: string | null;
  setOpenBookId: (id: string | null) => void;
}

const BookModalContext = createContext<BookModalContextType | undefined>(undefined);

export function BookModalProvider({ children }: { children: ReactNode }) {
  const [openBookId, setOpenBookId] = useState<string | null>(null);

  return (
    <BookModalContext.Provider value={{ openBookId, setOpenBookId }}>
      {children}
    </BookModalContext.Provider>
  );
}

export function useBookModal() {
  const context = useContext(BookModalContext);
  if (context === undefined) {
    throw new Error('useBookModal must be used within BookModalProvider');
  }
  return context;
}