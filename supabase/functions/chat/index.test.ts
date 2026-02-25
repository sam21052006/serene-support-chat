import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/chat`;

Deno.test("rejects unauthenticated requests with 401", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY },
    body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
  });
  assertEquals(response.status, 401);
  const data = await response.json();
  assertEquals(data.error, "Missing authorization");
});

Deno.test("rejects invalid auth token with 401", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": "Bearer invalid-token-here",
    },
    body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
  });
  assertEquals(response.status, 401);
  const data = await response.json();
  assertEquals(data.error, "Unauthorized");
});

Deno.test("handles CORS preflight", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "OPTIONS",
    headers: { "apikey": SUPABASE_ANON_KEY },
  });
  assertEquals(response.status, 200);
  await response.text();
});
