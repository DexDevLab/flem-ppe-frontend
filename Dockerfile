
FROM --platform=linux/amd64 node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
COPY prisma ./prisma/
COPY .env.production ./
COPY jsconfig.json ./
RUN yarn install --frozen-lockfile
RUN yarn prisma generate


FROM --platform=linux/amd64 node:16-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN yarn build

FROM --platform=linux/amd64 node:16-alpine AS runner
WORKDIR /app

RUN apk update && apk add --no-cache nmap && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
  apk update && \
  apk add --no-cache \
  chromium \
  harfbuzz \
  "freetype>2.8" \
  ttf-freefont \
  nss

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nextappgroup
RUN adduser --system --uid 1001 nextappuser

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder  /app/prisma /app/prisma


COPY --from=builder --chown=nextappuser:nextappgroup /app/.next/standalone ./
COPY --from=builder --chown=nextappuser:nextappgroup /app/.next/static ./.next/static

USER nextappuser

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]