import { Hono } from "hono"
import { setupNewsRoutes } from "./news.routes";

export const setupRouter = (app: Hono) => {
  const router = new Hono();

  // setup the main news router
  setupNewsRoutes(router);

  app.route("/apis", router);
}