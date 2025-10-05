FROM node:24-trixie-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /website
COPY /react /website

RUN corepack enable

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts \
    && pnpm run build

FROM nginxinc/nginx-unprivileged:stable-alpine-perl

COPY --from=build /website/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

HEALTHCHECK --interval=5m --timeout=3s CMD ["curl", "-f" , "http://localhost:8080/", "||", "exit 1"]

LABEL org.opencontainers.image.title="Chapter-Website"
LABEL org.opencontainers.image.description="ACM @ UC Merced's website"
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL org.opencontainers.image.source="https://github.com/UCMercedACM/Chapter-Website"
