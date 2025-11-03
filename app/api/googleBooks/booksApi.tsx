'use server'
export  async function FetchGoogleBooks(
  query: string, 
  maxResults: number = 40,
  orderBy: 'relevance' | 'newest' 
) {
   const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&orderBy=${orderBy}`,
  )
  const data = await res.json()
  
  if (!res.ok) throw new Error('Falha ao buscar livros');
  
  return data
}