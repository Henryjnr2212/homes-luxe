// Vercel Node.js serverless bridge for TanStack Start's Web API fetch handler.
// TanStack Start exports { fetch(Request, env, ctx) => Response }
// Vercel's Node.js runtime expects (req, res) — this file adapts between them.

import handler from "../dist/server/server.js";

export const config = {
  maxDuration: 30,
};

function toWebRequest(req) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url = new URL(req.url, `${protocol}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) for (const v of value) headers.append(key, v);
  }

  return new Request(url.toString(), {
    method: req.method || "GET",
    headers,
  });
}

export default async function vercelHandler(req, res) {
  try {
    const webRequest = toWebRequest(req);
    const webResponse = await handler.fetch(webRequest, {}, {});

    res.status(webResponse.status);

    for (const [key, value] of webResponse.headers.entries()) {
      res.setHeader(key, value);
    }

    const buffer = await webResponse.arrayBuffer();
    res.end(Buffer.from(buffer));
  } catch (err) {
    console.error("SSR handler error:", err);
    res.status(500).end("Internal Server Error");
  }
}
