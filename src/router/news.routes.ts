import { Hono } from "hono";
import { getArticle, getArticles, importArticles } from "../handlers/news.handlers";

export const setupNewsRoutes = (router : Hono) => {
  const newsApp = new Hono();

  // All the routes 
  newsApp.post('/import', importArticles);
  newsApp.get('/', getArticles);
  newsApp.get('/:id', getArticle);

  router.route("/news", newsApp)
}