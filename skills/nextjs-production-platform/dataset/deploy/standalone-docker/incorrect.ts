// INCORRECT: Runtime image assumes source install and package-manager start.
export const dockerfile = `
FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build
CMD ["bun", "run", "start"]
`;
