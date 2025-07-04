FROM oven/bun:1-slim AS build

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /website
COPY /react /website

RUN adduser --disabled-password --gecos "" website \
  && chown -R website:website /website/

USER website

RUN bun install --frozen-lockfile --ignore-scripts \
  && bun run build

FROM nginxinc/nginx-unprivileged:stable-alpine-perl

COPY --from=build /website/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

HEALTHCHECK --interval=5m --timeout=3s CMD ["curl", "-f" , "http://localhost:8080/", "||", "exit 1"]

LABEL org.opencontainers.image.title="Chapter-Website"
LABEL org.opencontainers.image.description="ACM @ UC Merced's website"
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL org.opencontainers.image.source="https://github.com/UCMercedACM/Chapter-Website"
