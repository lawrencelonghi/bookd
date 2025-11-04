'use server'
export async function FetchGoogleBooks(
  query: string, 
  maxResults: number,
  orderBy?: 'newest' 
) {

  let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
  
  if (orderBy === 'newest') {
    url += `&orderBy=${orderBy}`;
  }
  
  const res = await fetch(url);
  const data = await res.json();
  
  if (!res.ok) throw new Error('Falha ao buscar livros');
  
  return data;
}