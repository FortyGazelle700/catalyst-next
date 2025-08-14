FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install && bun run build
CMD ["bun", "run", "start"]