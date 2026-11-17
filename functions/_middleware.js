// Basic Auth gate for the Galeri.Fasad internal site.
// Recreated 2026-11-17 from the handover description: the original
// functions/_middleware.js lived only on the owner's laptop and was never
// copied to this workspace. Behaviour it must match: no (or wrong)
// credentials -> 401 with WWW-Authenticate: Basic realm="Galeri.Fasad Internal".
// Credentials come from the Pages project secrets INTERNAL_USER / INTERNAL_PASS,
// which are set in the Cloudflare dashboard, never in this file.
export async function onRequest(context) {
  const { request, env, next } = context;
  const auth = request.headers.get("Authorization") || "";
  const expected =
    "Basic " + btoa(`${env.INTERNAL_USER || ""}:${env.INTERNAL_PASS || ""}`);
  if (auth.length !== expected.length) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Galeri.Fasad Internal"' },
    });
  }
  let diff = 0;
  for (let i = 0; i < auth.length; i++) {
    diff |= auth.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (diff !== 0) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Galeri.Fasad Internal"' },
    });
  }
  return next();
}
