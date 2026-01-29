#!/usr/bin/env bun
import { fetchSitemap, parseSitemap } from "../src/utils/sitemap";
import { importArticlesToDb } from "../src/database/news";

const SITEMAP_URL = 'https://www.ndtv.com/sitemap/google-news-sitemap';

async function runNewsIngestion() {
  console.log(`[${new Date().toISOString()}] Starting news ingestion...`);
  
  try {
    // Fetch the sitemap
    console.log('Fetching sitemap...');
    const xml = await fetchSitemap(SITEMAP_URL);
    
    // Parse the XML
    console.log('Parsing sitemap...');
    const articles = await parseSitemap(xml);
    console.log(`Found ${articles.length} articles`);
    
    // Import to database
    console.log('Importing articles to database...');
    const result = await importArticlesToDb(articles);
    
    console.log('Import completed:', {
      total: result.total,
      inserted: result.inserted,
      updated: result.updated,
      failed: result.failed
    });
    
    if (result.errors.length > 0) {
      console.error('Errors encountered:', result.errors);
    }
    
    console.log(`[${new Date().toISOString()}] News ingestion completed successfully`);
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] News ingestion failed:`, error);
    process.exit(1);
  }
}

// Run the ingestion
runNewsIngestion();