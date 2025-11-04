import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { AuthProvider } from "./contexts/AuthContext";
import { Providers } from "./providers";

import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Bookd - share reading",
  description:
    "Bookd is a social platform for book lovers. Log what you read, share your thoughts, discover new titles, and keep track of your literary journey.",
  icons: {
    icon: "/images/logoBookd.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className="min-h-screen text-foreground font-sans antialiased">
        <AuthProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto max-w-7xl pt-8 px-6 flex-grow">
                {children}
              </main>
            </div>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}
