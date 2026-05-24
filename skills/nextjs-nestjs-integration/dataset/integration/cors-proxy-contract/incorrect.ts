// INCORRECT: Browser code mixes Next.js BFF and direct NestJS origins.
export async function saveUser(user: UserInput) {
  await fetch("/api/users", { method: "POST", body: JSON.stringify(user) });
  await fetch("https://api.example.com/audit", { method: "POST" });
}
