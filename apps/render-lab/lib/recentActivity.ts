export type ActivityItem = {
  id: string;
  type: "login" | "purchase" | "comment";
  message: string;
  createdAt: string;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getRecentActivityServer(
  userId: string
): Promise<ActivityItem[]> {
  await sleep(600); // Increase to exaggerate CSR delay

  return [
    {
      id: "a1",
      type: "login",
      message: `User ${userId} opened the dashboard`,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: "a2",
      type: "purchase",
      message: "Bought: Noise-cancelling headphones",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "a3",
      type: "comment",
      message: "Commented on: ‘RSC streaming is wild’",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  ];
}
