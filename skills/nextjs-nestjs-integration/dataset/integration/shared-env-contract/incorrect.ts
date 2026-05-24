// INCORRECT: A backend secret is exposed to the browser.
export const env = {
  apiSecret: process.env.NEXT_PUBLIC_API_SECRET!,
};
