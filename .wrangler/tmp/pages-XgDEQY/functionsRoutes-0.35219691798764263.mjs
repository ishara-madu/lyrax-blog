import { onRequestGet as __api_auth_ts_onRequestGet } from "/Users/ishara/Documents/lyrax-blog/functions/api/auth.ts"
import { onRequestGet as __api_callback_ts_onRequestGet } from "/Users/ishara/Documents/lyrax-blog/functions/api/callback.ts"

export const routes = [
    {
      routePath: "/api/auth",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_ts_onRequestGet],
    },
  {
      routePath: "/api/callback",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_callback_ts_onRequestGet],
    },
  ]