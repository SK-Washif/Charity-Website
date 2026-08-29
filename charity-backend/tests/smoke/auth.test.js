const test = require("node:test");
const assert = require("node:assert");

const hasEnv = process.env.MONGODB_URI && process.env.CLERK_SECRET_KEY;

test("protected route টোকেন ছাড়া 401 দেয়", { skip: !hasEnv }, async () => {
  const app = require("../../src/app");
  const http = require("node:http");
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  const res = await fetch(`http://localhost:${port}/api/programs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "টেস্ট" }),
  });
  assert.strictEqual(res.status, 401);
  server.close();
});
