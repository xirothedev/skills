// INCORRECT: Next.js duplicates a backend DTO by hand.
export async function createUser(name: string) {
  return fetch(`${process.env.NEXT_SERVER_API_ORIGIN}/users`, {
    method: "POST",
    body: JSON.stringify({ fullName: name }),
  });
}
