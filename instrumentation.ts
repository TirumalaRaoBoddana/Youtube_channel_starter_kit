export async function register() {
  // Runs once when the Next.js server boots (node runtime only).
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { seedDemoData } = await import("./lib/db/seed");
    await seedDemoData();
  }
}
