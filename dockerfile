FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install && bun run build
CMD ["bun", "run", "start"]