import { parser } from "./parsers" 

interface ParsedArticle {
  id: string 
  title: string 
  url: string 
  publication_date: Date | null 
  keywords: string[] 
}

// Fetches the news sitemap
export async function fetchSitemap(url: string): Promise<string> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
    },
  }) 

  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap: ${res.status} ${res.statusText}`) 
  }

  return await res.text() 
}

// Generates a hash from URL
function hashUrlSync(url: string): string {
  const hasher = new Bun.CryptoHasher('sha256') 
  hasher.update(url) 
  return hasher.digest('hex') 
}

// Extracts article data from a single URL entry
async function extractArticleData(urlEntry: any): Promise<ParsedArticle | null> {
  try {
    const loc = urlEntry.loc 
    if (!loc) return null 

    // Generate hash from URL
    const id = hashUrlSync(loc) 

    const newsData = urlEntry['news:news'] 
    const title = newsData?.['news:title'] || '' 
    const publicationDate = newsData?.['news:publication_date'] 
    const keywords = newsData?.['news:keywords'] 

    return {
      id,
      title,
      url: loc,
      publication_date: publicationDate ? new Date(publicationDate) : null,
      keywords: keywords ? keywords.split(',').map((k: string) => k.trim()) : [],
    } 
  } catch (err) {
    console.error('Error extracting article data:', err) 
    return null 
  }
}

// Parses XML sitemap and extracts article data
export async function parseSitemap(xml: string): Promise<ParsedArticle[]> {
  const parsed = parser.parse(xml) 
  const articles: ParsedArticle[] = [] 

  const urlset = parsed.urlset 
  if (!urlset || !urlset.url) {
    throw new Error('Invalid sitemap structure') 
  }

  const urls = Array.isArray(urlset.url) ? urlset.url : [urlset.url] 

  for (const urlEntry of urls) {
    try {
      const article = await extractArticleData(urlEntry) 
      if (article) {
        articles.push(article) 
      }
    } catch (err) {
      console.warn('Failed to parse article entry:', err) 
    }
  }

  return articles 
}