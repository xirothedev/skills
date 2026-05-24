// CORRECT: Browser code talks to one public boundary.
export async function saveUser(user: UserInput) {
  await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
}
