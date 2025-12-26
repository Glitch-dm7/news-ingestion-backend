import { Context } from "hono" 
import { fetchSitemap, parseSitemap } from "../utils/sitemap" 
import { getArticleById, importArticlesToDb, queryArticles } from "../database/news" 
import { errorResponse, successResponse } from "../utils/response" 

export const importArticles = async(c: Context) => {
  try {
    const xml = await fetchSitemap(
      'https://www.ndtv.com/sitemap/google-news-sitemap'
    ) 

    const articles = await parseSitemap(xml) 

    const result = await importArticlesToDb(articles) 

    return successResponse(c, result, 200) 
  } catch (err) {
    console.error('Import error:', err) 
    return errorResponse(
      c,
      'Failed to import articles',
      500,
      err instanceof Error ? err.message : undefined
    ) 
  }
}

export const getArticles = async(c: Context) => {
  try {
    const { after, before, page = '1', limit = '10' } = c.req.query() 

    // Validate dates
    const afterDate = after ? new Date(after) : undefined 
    const beforeDate = before ? new Date(before) : undefined 

    if (after && isNaN(afterDate!.getTime())) {
      return errorResponse(c, 'Invalid "after" date format', 400) 
    }
    if (before && isNaN(beforeDate!.getTime())) {
      return errorResponse(c, 'Invalid "before" date format', 400) 
    }

    // Validate pagination
    const pageNum = parseInt(page) 
    const limitNum = parseInt(limit) 

    if (isNaN(pageNum) || pageNum < 1) {
      return errorResponse(c, 'Invalid page number', 400) 
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return errorResponse(c, 'Invalid limit (must be 1-100)', 400) 
    }

    const result = await queryArticles(
      { after: afterDate, before: beforeDate },
      { page: pageNum, limit: limitNum }
    ) 

    return successResponse(c, result, 200) 
  } catch (err) {
    console.error('Query error:', err) 
    return errorResponse(c, 'Failed to query articles', 500) 
  }
}

export const getArticle = async(c: Context) => {
  try {
    const { id } = c.req.param() 

    if (!id) {
      return errorResponse(c, 'Article ID is required', 400) 
    }

    const article = await getArticleById(id) 

    if (!article) {
      return errorResponse(c, 'Article not found', 404) 
    }

    return successResponse(c, article, 200) 
  } catch (err) {
    console.error('Get article error:', err) 
    return errorResponse(c, 'Failed to get article', 500) 
  }
}