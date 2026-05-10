import { delay, HttpResponse, http } from "msw";

export const handlers = [
  // Users endpoint
  http.get("/api/users", async () =>
    HttpResponse.json([
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
    ])
  ),

  // User by ID
  http.get("/api/users/:id", async ({ params }) => {
    const { id } = params;
    return HttpResponse.json({ id: Number(id), name: `User ${id}` });
  }),

  // Create user
  http.post("/api/users", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 3, ...(body as object) }, { status: 201 });
  }),

  // Slow endpoint for loading state testing
  http.get("/api/slow", async () => {
    await delay(2000);
    return HttpResponse.json({ message: "Finally loaded!" });
  }),

  // Error endpoint
  http.get("/api/error", () =>
    HttpResponse.json({ error: "Something went wrong" }, { status: 500 })
  ),

  // Posts endpoint
  http.get("/api/posts", () =>
    HttpResponse.json([
      { id: 1, title: "First Post", body: "Hello world" },
      { id: 2, title: "Second Post", body: "Testing is fun" },
    ])
  ),
];
