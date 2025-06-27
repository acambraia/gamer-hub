FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN npm install -g serve

COPY . .

RUN pnpm run build

EXPOSE 80

CMD ["npx", "serve", "-s", "dist", "-l", "80"]

