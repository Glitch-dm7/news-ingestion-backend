import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

export const successResponse = (c:Context, data:any, statusCode : ContentfulStatusCode = 200) => {
  return c.json({
    success : true,
    data
  }, statusCode)
}

export const errorResponse = (c:Context, error:string, statusCode:ContentfulStatusCode = 500, details?:any) => {
  return c.json({
    success: false,
    error,
    ...(details && {details})
  }, statusCode)
}