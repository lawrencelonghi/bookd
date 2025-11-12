'use server'

export async function FetchGoogleBooks(
  query: string, 
  maxResults: number,
  orderBy?: 'newest' 
) {
  try {
    let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
    
    if (orderBy === 'newest') {
      url += `&orderBy=${orderBy}`;
    }
    
    // Adicionar cache e timeout
    const res = await fetch(url, {
      next: { 
        revalidate: 3600 // Cache por 1 hora
      },
      signal: AbortSignal.timeout(10000) // Timeout de 10s
    });
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Melhorar qualidade das imagens
    if (data.items) {
      data.items = data.items.map((item: any) => {
        if (item.volumeInfo?.imageLinks) {
          const links = item.volumeInfo.imageLinks;
          
          // Priorizar imagens de maior qualidade
          item.volumeInfo.imageUrl = 
            links.extraLarge?.replace('http://', 'https://') ||
            links.large?.replace('http://', 'https://') ||
            links.medium?.replace('http://', 'https://') ||
            links.small?.replace('http://', 'https://') ||
            links.thumbnail?.replace('http://', 'https://') ||
            links.smallThumbnail?.replace('http://', 'https://');
          
          // Remover zoom=1 para melhor qualidade
          if (item.volumeInfo.imageUrl) {
            item.volumeInfo.imageUrl = item.volumeInfo.imageUrl.replace('&zoom=1', '');
          }
        }
        return item;
      });
    }
    
    return data;
    
  } catch (error) {
    console.error('Error fetching Google Books:', error);
    throw new Error('Falha ao buscar livros');
  }
}