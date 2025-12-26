import { db } from './db';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { news } from './schema/news.schema';

interface ParsedArticle {
  id: string;
  title: string;
  url: string;
  publication_date: Date | null;
  keywords: string[];
}

interface ImportResult {
  total: number;
  inserted: number;
  updated: number;
  failed: number;
  errors: Array<{ url: string; error: string }>;
}

interface TimeFilter {
  after?: Date;
  before?: Date;
}

interface PaginationOptions {
  page: number;
  limit: number;
}

interface ArticleQueryResult {
  articles: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Upserts a single article
async function upsertArticle(
  article: ParsedArticle,
  result: ImportResult
): Promise<void> {
  const existing = await db
    .select()
    .from(news)
    .where(eq(news.id, article.id))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(news)
      .set({
        title: article.title,
        url: article.url,
        publication_date: article.publication_date,
        keywords: article.keywords,
        updated_at: new Date(),
      })
      .where(eq(news.id, article.id));

    result.updated++;
  } else {
    await db.insert(news).values({
      id: article.id,
      title: article.title,
      url: article.url,
      publication_date: article.publication_date,
      keywords: article.keywords,
      updated_at: new Date(),
    });

    result.inserted++;
  }
}

// Imports articles into the database with duplicate handling
export async function importArticlesToDb(
  articles: ParsedArticle[]
): Promise<ImportResult> {
  const result: ImportResult = {
    total: articles.length,
    inserted: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  for (const article of articles) {
    try {
      await upsertArticle(article, result);
    } catch (err) {
      result.failed++;
      result.errors.push({
        url: article.url,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return result;
}

// Query articles with time filters and pagination
export async function queryArticles(
  filters: TimeFilter,
  pagination: PaginationOptions
): Promise<ArticleQueryResult> {
  const { after, before } = filters;
  const { page, limit } = pagination;

  const conditions = [];
  if (after) {
    conditions.push(gte(news.publication_date, after));
  }
  if (before) {
    conditions.push(lte(news.publication_date, before));
  }

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(news)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const total = Number(countResult[0]?.count || 0);

  const offset = (page - 1) * limit;
  const articles = await db
    .select()
    .from(news)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(news.publication_date)
    .limit(limit)
    .offset(offset);

  return {
    articles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Get article by ID
export async function getArticleById(id: string) {
  const result = await db
    .select()
    .from(news)
    .where(eq(news.id, id))
    .limit(1);

  return result[0] || null;
}