// Vercel serverless entry — wraps TanStack Start's SSR handler.
// Built output lands in dist/server/server.js (via `bun run build`).
import handler from "../dist/server/server.js";

export default handler;
