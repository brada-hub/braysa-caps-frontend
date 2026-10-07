FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm config set dangerously-allow-all-builds true
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["pnpm", "start"]
